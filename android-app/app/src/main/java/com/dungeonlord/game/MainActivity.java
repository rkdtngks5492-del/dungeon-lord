package com.dungeonlord.game;

import android.annotation.SuppressLint;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;

public class MainActivity extends AppCompatActivity {

    /* ↓↓↓ 구글이 제공하는 테스트 광고 단위입니다.
       출시 전 애드몹에서 만든 본인 단위 ID로 바꾸세요.
       개발 중에 실제 단위로 본인이 광고를 누르면 계정이 정지될 수 있습니다. */
    private static final String REWARDED_UNIT     = "ca-app-pub-3940256099942544/5224354917";
    private static final String INTERSTITIAL_UNIT = "ca-app-pub-3940256099942544/1033173712";

    private WebView web;
    private RewardedAd rewarded;
    private InterstitialAd interstitial;
    private boolean earned = false;
    /* 광고가 떠 있는 동안에는 뒤로 가기·백그라운드 신호를 게임에 보내지 않는다 */
    private boolean adShowing = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        MobileAds.initialize(this, status -> { });
        loadRewarded();
        loadInterstitial();

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        /* 게임 저장이 localStorage를 쓰므로 이게 꺼져 있으면 진행 상황이 날아갑니다 */
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE);
        web.setBackgroundColor(0xFF0B0712);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        /* 덱 이름 바꾸기(prompt) 같은 JS 입력창을 띄우려면 필요하다 */
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new AdBridge(), "AndroidAds");
        web.addJavascriptInterface(new AppBridge(), "AndroidApp");
        /* TODO: 결제 연동을 마치면 아래 줄의 주석을 푼다. 그 전에는 게임이 "Play 스토어 등록 후 열려요"라고 안내한다 */
        // web.addJavascriptInterface(new BillingBridge(), "AndroidBilling");
        web.loadUrl("file:///android_asset/index.html");
        setContentView(web);

        hideSystemBars();

        /* 뒤로 가기는 게임(window.onBack)이 처리한다: 팝업 닫기 · 일시정지 · 탭 이동 · 종료 확인 */
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() {
                if (adShowing) return;
                web.evaluateJavascript("window.onBack && window.onBack()", null);
            }
        });
    }

    /* 홈 버튼·전화 등으로 앱이 가려지면 전투를 일시정지한다 */
    @Override
    protected void onPause() {
        super.onPause();
        if (web != null && !adShowing) web.evaluateJavascript("window.onAppPause && window.onAppPause()", null);
    }

    private void hideSystemBars() {
        View d = getWindow().getDecorView();
        d.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean has) {
        super.onWindowFocusChanged(has);
        if (has) hideSystemBars();
    }

    /* ---------- 광고 적재 ---------- */
    private void loadRewarded() {
        RewardedAd.load(this, REWARDED_UNIT, new AdRequest.Builder().build(),
                new RewardedAdLoadCallback() {
                    @Override public void onAdLoaded(@NonNull RewardedAd ad) { rewarded = ad; }
                    @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { rewarded = null; }
                });
    }

    private void loadInterstitial() {
        InterstitialAd.load(this, INTERSTITIAL_UNIT, new AdRequest.Builder().build(),
                new InterstitialAdLoadCallback() {
                    @Override public void onAdLoaded(@NonNull InterstitialAd ad) { interstitial = ad; }
                    @Override public void onAdFailedToLoad(@NonNull LoadAdError e) { interstitial = null; }
                });
    }

    /* 자바스크립트로 결과를 돌려준다. 게임 쪽 window.onAdResult(boolean)가 받는다 */
    private void replyToGame(final boolean ok) {
        web.post(() -> web.evaluateJavascript("window.onAdResult(" + ok + ")", null));
    }

    /* ---------- 게임에서 부르는 창구 ---------- */
    public class AdBridge {

        @JavascriptInterface
        public void showRewarded() {
            runOnUiThread(() -> {
                if (rewarded == null) {
                    /* 아직 안 불러와졌으면 보상 없이 바로 알려 주고 다음을 준비한다 */
                    loadRewarded();
                    replyToGame(false);
                    return;
                }
                earned = false; adShowing = true;
                rewarded.setFullScreenContentCallback(new FullScreenContentCallback() {
                    @Override public void onAdDismissedFullScreenContent() {
                        adShowing = false; rewarded = null; loadRewarded(); replyToGame(earned);
                    }
                    @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) {
                        adShowing = false; rewarded = null; loadRewarded(); replyToGame(false);
                    }
                });
                rewarded.show(MainActivity.this, r -> earned = true);
            });
        }

        @JavascriptInterface
        public void showInterstitial() {
            runOnUiThread(() -> {
                if (interstitial == null) { loadInterstitial(); return; }
                adShowing = true;
                interstitial.setFullScreenContentCallback(new FullScreenContentCallback() {
                    @Override public void onAdDismissedFullScreenContent() {
                        adShowing = false; interstitial = null; loadInterstitial();
                    }
                    @Override public void onAdFailedToShowFullScreenContent(@NonNull AdError e) {
                        adShowing = false; interstitial = null; loadInterstitial();
                    }
                });
                interstitial.show(MainActivity.this);
            });
        }
    }

    /* ---------- 인앱 결제 (자리만) ----------
       TODO: Play Console에 인앱 상품(예: remove_ads)을 등록한 뒤 Google Play Billing Library를 붙인다.
       결제가 끝나면 replyPurchase(상품ID, true)로 게임에 알려 주면 게임이 광고 제거 플래그를 켠다.
       지금은 결제 연동 전이라 항상 실패로 돌려준다. */
    private void replyPurchase(final String productId, final boolean ok) {
        final String id = org.json.JSONObject.quote(productId);
        web.post(() -> web.evaluateJavascript("window.onPurchaseResult(" + id + "," + ok + ")", null));
    }

    public class BillingBridge {
        @JavascriptInterface
        public void buy(String productId) {
            runOnUiThread(() -> replyPurchase(productId, false));
        }
    }

    /* ---------- 앱 기능 창구 (종료 · 진동) ---------- */
    public class AppBridge {
        /* 디버그 빌드에서만 true: 게임의 '디버그 표시' 메뉴가 이걸로 보이거나 숨는다 */
        @JavascriptInterface
        public boolean isDebug() { return (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0; }

        /* 게임의 "게임을 종료할까요?"에서 종료를 누르면 */
        @JavascriptInterface
        public void exit() { runOnUiThread(MainActivity.this::finish); }

        @JavascriptInterface
        public void vibrate(int ms) {
            Vibrator v = (Vibrator) getSystemService(VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            long t = Math.max(1, Math.min(1000, ms));
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(t, VibrationEffect.DEFAULT_AMPLITUDE));
            else v.vibrate(t);
        }
    }
}

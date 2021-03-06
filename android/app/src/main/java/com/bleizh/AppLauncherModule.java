package com.bleizh;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.content.pm.ResolveInfo;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.helper.Utility;

import java.io.File;
import java.util.List;

import javax.annotation.Nonnull;

class AppLauncherModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AppLauncherModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return "AppLauncher";
    }

    @ReactMethod
    public void getApplications(Promise promise) {
        try {
            PackageManager pm = this.reactContext.getPackageManager();
            Intent intent = new Intent(Intent.ACTION_MAIN, null);
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
            List<ResolveInfo> activitiesInfo = pm.queryIntentActivities(intent, 0);
            WritableArray list = Arguments.createArray();
            for (int i = 0; i < activitiesInfo.size(); i++) {
                ResolveInfo info = activitiesInfo.get(i);
                App app = new App(pm, info);

                WritableMap appInfo = Arguments.createMap();
                appInfo.putString("packageName", app.getPackageName());
                appInfo.putString("appName", ((String) app.getLabel()).trim());
                Drawable icon = app.getIcon();
                appInfo.putString("icon", Utility.convert(icon));

                list.pushMap(appInfo);
            }
            promise.resolve(list);
        } catch (Exception ex) {
            promise.reject(ex);
        }
    }

    @ReactMethod
    public void startApplication(String packageName) {
        Intent launchIntent = this.reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
        this.reactContext.startActivity(launchIntent);
    }

    private boolean isSystemPackage(PackageInfo pkgInfo) {
        if ((pkgInfo.applicationInfo.flags & ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0) {
            return false;
        }
        if ((pkgInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) == 1) {
            return true;
        }
        return false;
    }


}
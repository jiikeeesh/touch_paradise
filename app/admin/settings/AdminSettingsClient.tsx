"use client";

import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react";
import { R2PhotoPicker } from "@/components/R2PhotoPicker";

export default function AdminSettingsClient() {
  const [heroImage, setHeroImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const heroImgSetting = data.find((s: any) => s.key === "hero_image");
        if (heroImgSetting) {
          setHeroImage(heroImgSetting.value);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_image", value: heroImage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 max-w-3xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <ImageIcon className="w-6 h-6 text-emerald-600" />
        Homepage Hero Image
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="e.g. /hero.png or https://..."
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => setShowPicker(true)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition shrink-0"
            >
              Browse
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            This image is displayed at the top of the homepage.
          </p>
        </div>

        {heroImage && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 h-64 relative bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={heroImage} 
              alt="Hero Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NDc0OGIiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
        )}

        <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {showPicker && (
        <R2PhotoPicker
          attachedUrls={heroImage ? [heroImage] : []}
          onSelect={(urls) => {
            if (urls.length > 0) {
              setHeroImage(urls[urls.length - 1]);
            }
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

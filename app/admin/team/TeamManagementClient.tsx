"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Plus, Edit2, Trash2, Users } from "lucide-react";
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/app/actions/team";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
}

const inputCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const textareaCls =
  "w-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none";

export default function TeamManagementClient({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState("0");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setRole("");
    setBio("");
    setImage("");
    setOrder("0");
    setEditingMember(null);
    setIsAdding(false);
    setError("");
  };

  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio);
    setImage(member.image);
    setOrder(String(member.order));
    setIsAdding(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const blob = await res.json();
      setImage(blob.url);
    } catch (e: any) {
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const data = { name, role, bio, image, order: Number(order) };

    try {
      if (editingMember) {
        const res = await updateTeamMember(editingMember.id, data);
        if (res.success && res.member) {
          setMembers(members.map((m) => (m.id === editingMember.id ? (res.member as TeamMember) : m)));
          resetForm();
        } else {
          throw new Error(res.error || "Failed to update member");
        }
      } else {
        const res = await createTeamMember(data);
        if (res.success && res.member) {
          setMembers([...members, res.member as TeamMember]);
          resetForm();
        } else {
          throw new Error(res.error || "Failed to create member");
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const res = await deleteTeamMember(id);
      if (res.success) {
        setMembers(members.filter((m) => m.id !== id));
      } else {
        throw new Error(res.error || "Failed to delete");
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Button / Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-5 h-5" />
            Add New Member
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingMember ? "Edit Team Member" : "Add New Team Member"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pemba Sherpa"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Role/Position *
                </label>
                <input
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Expedition Guide"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Short Bio *
              </label>
              <textarea
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Brief description of experience, specialties, etc."
                className={textareaCls}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Profile Photo *
                </label>
                <div className="flex items-start gap-4">
                  {image && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image src={image} alt="Profile" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-wider">
                      {uploading ? "Uploading" : "Upload"}
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-700 transition disabled:opacity-60 shadow-lg shadow-emerald-600/20"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    {editingMember ? "Update Member" : "Add Member"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Current Team Members ({members.length})
          </h2>
        </div>

        {members.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-slate-500">No team members added yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <div key={member.id} className="p-6 flex items-start gap-6 hover:bg-slate-50/50 transition group">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-slate-100 group-hover:ring-emerald-100 transition">
                    <Image src={member.image || "/trekkers.png"} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{member.name}</h3>
                        <p className="text-emerald-600 font-semibold text-sm">{member.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(member)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2">{member.bio}</p>
                    <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Order: {member.order}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

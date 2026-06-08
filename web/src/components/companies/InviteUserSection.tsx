"use client";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { apiClient, apiFetcher } from "@/utils/api";
import SubmitButton from "../core/SubmitButton";
import toast from "react-hot-toast";
import {
  Mail,
  Shield,
  UserPlus,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
} from "lucide-react";

type User = {
  id: string;
  email: string;
  access: string;
  status: string;
  createdAt: string;
};

export default function InviteUserSection() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("id");
  const {
    data: users,
    mutate,
    isLoading,
  } = useSWR(
    companyId ? `/users?filter={"company": "${companyId}"}` : null,
    apiFetcher,
  );

 const handleInvite = async (formData: FormData) => {
  try {
    const email = String(formData.get("email"));
    const access = String(formData.get("access"));

    // Create user
    await apiClient.post("/users", {
      email,
      access,
      company: companyId,
    });

    // Send invitation email
    await apiClient.post("/invitations", {
      email,
      company: companyId,
      access,
    });

    toast.success("Invitation sent successfully!");
    mutate();

    const form = document.getElementById(
      "invite-form"
    ) as HTMLFormElement;

    form?.reset();
  } catch (error) {
    console.error(error);
    toast.error("Failed to send invitation.");
  }
};
  const handleRevoke = async (userId: string) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      toast.success("User revoked.");
      mutate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to revoke user.");
    }
  };

  return (
    <div className="card-meltwater p-0 overflow-hidden mb-8 border-primary/10">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Invite Form Section */}
        <div className="p-8 lg:w-1/3">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <UserPlus className="text-primary" size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              Invite Member
            </h2>
          </div>
          <p className="text-sm font-medium text-foreground/40 mb-8 leading-relaxed">
            Invite a new member to join this company workspace and collaborate.
          </p>

          <form id="invite-form" action={handleInvite} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-transparent focus:border-primary/30 rounded-xl text-sm font-bold placeholder:text-foreground/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest px-1">
                Access Level
              </label>
              <div className="relative group">
                <Shield
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors"
                  size={18}
                />
                <select
                  name="access"
                  required
                  defaultValue="READ"
                  className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-transparent focus:border-primary/30 rounded-xl text-sm font-bold outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="READ">Read Only</option>
                  <option value="WRITE">Full Access</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <SubmitButton
                title="Send Invitation"
                className="w-full btn-pill bg-primary text-primary-foreground py-3 font-bold text-sm shadow-lg shadow-primary/20"
              />
            </div>
          </form>
        </div>

        {/* Invited Users List */}
        <div className="p-8 lg:w-2/3 bg-foreground/[0.01]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-foreground">
              Invited Members
            </h3>
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest bg-foreground/5 px-2.5 py-1 rounded-full">
              {users?.length || 0} Total
            </span>
          </div>

          <div className="overflow-hidden border border-border/50 rounded-2xl bg-background shadow-sm">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-foreground/[0.02] border-b border-border">
                  <th className="py-4 px-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                    Member
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                    Access
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="py-4 px-6 text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-bold">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" />
                    </td>
                  </tr>
                ) : users && users.length > 0 ? (
                  users.map((user: User) => (
                    <tr
                      key={user.id}
                      className="hover:bg-foreground/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-foreground">
                            {user.email.split("@")[0]}
                          </span>
                          <span className="text-[10px] text-foreground/40 font-medium">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">
                          {user.access}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5">
                          {user.status === "ACCEPTED" ? (
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Clock size={14} className="text-amber-500" />
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              user.status === "ACCEPTED"
                                ? "text-emerald-500"
                                : "text-amber-500"
                            }`}
                          >
                            {user.status || "PENDING"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleRevoke(user.id)}
                          className="p-2 text-foreground/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Revoke Invitation"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <UserPlus size={40} />
                        <p className="text-xs font-bold uppercase tracking-widest">
                          No pending invitations
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

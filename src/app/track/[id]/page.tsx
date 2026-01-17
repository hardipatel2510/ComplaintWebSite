"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { hashPasscode } from "@/lib/utils";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function ComplaintStatus() {
  const { id } = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const complaintId = Array.isArray(id) ? id[0] : id;
    if (!complaintId) return;

    // Validate Passcode from Session
    const checkPasscode = async (data: Complaint) => {
        if (data.passcode) {
            const storedPass = sessionStorage.getItem(`passcode_${complaintId}`);
            if (!storedPass) {
                // Redirect to login if no passcode found in session
                router.replace('/track');
                return false;
            }
            const hash = await hashPasscode(storedPass);
            if (hash !== data.passcode) {
                router.replace('/track');
                return false;
            }
        }
        return true;
    };

    const unsubscribe = onSnapshot(doc(db, "complaints", complaintId), async (docSnap) => {
      setLoading(true);
      if (docSnap.exists()) {
        const data = docSnap.data() as Complaint;
        const authorized = await checkPasscode(data);
        if (authorized) {
            setComplaint(data);
            setError(null);
        }
      } else {
        setError("Complaint not found.");
      }
      setLoading(false);
    }, (err) => {
        console.error(err);
        setError("Access denied or invalid ID.");
        setLoading(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  if (loading) {
     return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 flex flex-col items-center max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
        </div>
     )
  }

  if (error || !complaint) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error || "Something went wrong."}</AlertDescription>
                  <div className="pt-4">
                    <Link href="/track"><Button variant="outline" size="sm">Try Again</Button></Link>
                  </div>
              </Alert>
          </div>
      )
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1116] p-4">
        <Alert variant="destructive" className="max-w-md bg-red-900/20 border-red-500/50 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Accessing Record</AlertTitle>
          <AlertDescription>
            {error || "Complaint record not found or access denied."}
          </AlertDescription>
        </Alert>
        <Button 
            variant="link" 
            className="mt-4 text-gray-400 hover:text-white"
            onClick={() => router.push('/track')}
        >
            Try Again
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Submitted': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
          case 'Viewed': return 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20';
          case 'Under Review': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
          case 'Working': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
          case 'Investigation': return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
          case 'Resolved': return 'bg-green-500/10 text-green-500 border border-green-500/20';
          case 'Dismissed': return 'bg-red-500/10 text-red-500 border border-red-500/20';
          default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0A1116] px-4 relative overflow-hidden py-8">
        {/* Ambient Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[20%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

      <div className="max-w-3xl mx-auto relative z-10 w-full space-y-8">
        <div className="flex items-center justify-between">
            <Link href="/track" className="text-sm text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2">
                &larr; Back to Tracker
            </Link>
            <div className="text-xs text-gray-500 font-mono">
                Session Secure
            </div>
        </div>

        <Card className="bg-black/40 border-white/10 shadow-2xl backdrop-blur-md overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-6">
            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <CardTitle className="text-2xl text-white font-bold flex items-center gap-3">
                        Complaint Status
                        <Badge variant="outline" className="text-teal-400 border-teal-500/30 bg-teal-500/10 font-mono font-normal">
                            {complaint.complaintId}
                        </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-1 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Submitted on {complaint.createdAt ? format(new Date(complaint.createdAt.seconds * 1000), "PPP") : "Unknown"}
                    </CardDescription>
                </div>
                {/* Status Badge */}
                <div className={`px-4 py-1.5 rounded-full border text-sm font-medium ${
                    complaint.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    complaint.status === 'Dismissed' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                    {complaint.status}
                </div>
            </div>
            
            {/* Progress Bar (Visual Only) */}
            <div className="w-full bg-white/5 h-1.5 mt-6 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                        complaint.status === 'Resolved' ? 'w-full bg-green-500' :
                        complaint.status === 'Dismissed' ? 'w-full bg-red-500' :
                        complaint.status === 'Investigation' ? 'w-[75%] bg-blue-500' :
                        complaint.status === 'Under Review' ? 'w-[50%] bg-blue-500' :
                        'w-[25%] bg-teal-500'
                    }`}
                />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Updates Section */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-500" />
                    Case Timeline
                </h3>
                
                <div className="space-y-4">
                    <div className="border-l-2 border-white/10 pl-4 ml-2 space-y-6">
                        {/* Current Status Item */}
                        <div className="relative">
                            <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-[#0A1116]" />
                            <p className="text-white font-medium">Current Status: {complaint.status}</p>
                            <p className="text-sm text-gray-500 mt-1">Your report is currently in this stage.</p>
                        </div>

                         {/* Dynamic Public Updates */}
                         {complaint.publicUpdates?.map((update, idx) => (
                             <div key={idx} className="relative">
                                  <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0A1116]" />
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                                      <p className="text-gray-300 font-medium">Update from Committee</p>
                                      <span className="text-xs text-gray-500">
                                          {format(update.date.toDate(), "PPP p")}
                                      </span>
                                  </div>
                                  <p className="text-sm text-gray-400 bg-white/5 p-3 rounded-lg border border-white/5">
                                      {update.message}
                                  </p>
                             </div>
                         ))}

                         {/* Submitted Item */}
                         <div className="relative opacity-50">
                            <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-600 border-2 border-[#0A1116]" />
                            <p className="text-gray-300 font-medium">Complaint Received</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {complaint.createdAt ? format(new Date(complaint.createdAt.seconds * 1000), "PPP p") : "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
             {/* Evidence Section */}
             {complaint.attachmentUrl && (
                 <div className="pt-4 border-t border-white/10">
                    <span className="text-gray-500 block text-sm mb-2 font-medium">Attached Evidence</span>
                    <div className="rounded-lg border border-white/10 overflow-hidden relative group max-w-sm bg-black/50">
                        <img 
                            src={complaint.attachmentUrl} 
                            alt="Evidence" 
                            className="w-full h-auto object-cover max-h-[300px]" 
                        />
                        <a 
                            href={complaint.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium backdrop-blur-sm"
                        >
                            View Full Size
                        </a>
                    </div>
                 </div>
             )}

            {/* Info Box */}
            <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg">
                <p className="text-sm text-blue-200/80">
                    <span className="font-semibold text-blue-400">Note:</span> To maintain anonymity, we do not display detailed investigation notes here. 
                    If additional information is required, a secure request will appear on this dashboard.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

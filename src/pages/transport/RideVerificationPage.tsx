import { useState } from "react";
import { ArrowLeft, Camera, MapPin, Clock, Shield, Share2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rideRecords } from "@/data/phase2Data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const RideVerificationPage = () => {
  const navigate = useNavigate();
  const activeRide = rideRecords.find(r => r.status === "active");

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft className="w-5 h-5 text-foreground" /></button>
        <h1 className="text-xl font-heading font-bold">Ride Verification</h1>
      </div>

      {activeRide && (
        <div className="px-5 mb-4">
          <div className="p-4 rounded-2xl border-2 border-sage bg-sage-light/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span className="text-xs font-semibold text-sage uppercase">Live Ride</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{activeRide.driverPhoto}</span>
              <div className="flex-1">
                <h3 className="text-sm font-heading font-bold">{activeRide.driverName}</h3>
                <p className="text-xs text-muted-foreground">{activeRide.vehicleModel} · {activeRide.licensePlate}</p>
              </div>
              <Badge className="text-[10px] bg-sage-light text-sage border-0">⭐ {activeRide.rating}</Badge>
            </div>
            <div className="space-y-1.5 mb-3 text-xs">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sage" /><span className="text-muted-foreground">From:</span> {activeRide.from}</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /><span className="text-muted-foreground">To:</span> {activeRide.to}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 rounded-xl bg-sage text-primary-foreground text-xs"><Share2 className="w-3.5 h-3.5 mr-1" />Share with Circle</Button>
              <Button size="sm" variant="outline" className="rounded-xl text-xs border-destructive text-destructive"><AlertTriangle className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mb-4">
        <Button className="w-full rounded-xl safe-gradient text-primary-foreground">
          <Camera className="w-4 h-4 mr-2" /> Verify New Ride
        </Button>
        <p className="text-[10px] text-center text-muted-foreground mt-2">Photograph license plate to verify driver</p>
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Recent Rides</h3>
        <div className="space-y-2">
          {rideRecords.filter(r => r.status === "completed").map(ride => (
            <div key={ride.id} className="p-3 rounded-xl bg-card border border-border flex items-center gap-3">
              <span className="text-lg">{ride.driverPhoto}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{ride.driverName}</p>
                <p className="text-xs text-muted-foreground">{ride.from} → {ride.to}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{ride.date}</p>
                <p className="text-xs">⭐ {ride.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RideVerificationPage;

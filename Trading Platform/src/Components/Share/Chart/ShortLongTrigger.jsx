import React from "react";
import { useVolume } from "../../../Utilities/Context/VolumeContext";

export default function ShortLongTrigger() {
  const { totalVolumes } = useVolume();
  const askVol = parseFloat(totalVolumes.ask);
  const bidVol = parseFloat(totalVolumes.bid);
  const totalVol = askVol + bidVol;
  const askVolPersentage = (totalVol - askVol) / totalVol;
  const bidVolPersentage = (totalVol - bidVol) / totalVol;
  // console.log(askVol);
  // console.log(bidVol);
  // console.log(askVolPersentage);

  return (
    <div className="mx-4 my-2 h-6">
      <div>
        <div className="flex gap-0.5">
          <div
            style={{ width: `${bidVolPersentage * 100}%` }}
            className="bg-success-success1 long-side relative h-1.5 overflow-hidden"
          ></div>
          <div
            style={{ width: `${askVolPersentage * 100}%` }}
            className="bg-danger-danger1 short-side relative h-1.5 overflow-hidden"
          ></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-success-success1 text-xs">
            Buy : {(bidVolPersentage * 100).toFixed(1)}%
          </span>
          <span className="text-danger-danger1 text-xs">
            Sell : {(askVolPersentage * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

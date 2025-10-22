import React from "react";

export default function SpotBtn({ className, title, onclick }) {
  return (
    <div className={className} onClick={onclick}>
      {title}
    </div>
  );
}

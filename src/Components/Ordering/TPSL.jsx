import OrderInput from "../Input/OrderInput";

export default function TPSL() {
  return (
    <div className="border-border-border1 h-min-8 mx-4 my-3 flex items-start border-t border-b">
      <div className="relative flex w-full flex-wrap items-center space-x-2 py-2">
        <input
          type="checkbox"
          id="TP/SL"
          className="border-border-border2 peer h-3.5 w-3.5 appearance-none rounded-xs border checked:appearance-auto"
        />
        <label
          htmlFor="TP/SL"
          className="flex justify-between text-xs"
          style={{ width: "calc(100% - 2rem)" }}
        >
          TP/SL
        </label>
        <span className="text-primary-primary3 absolute top-0 right-0 pt-2 text-xs">
          Advanced
        </span>

        <div className="mt-4 hidden w-full peer-checked:block">
          <OrderInput text="Take Profit" detail="Lastest" />
          <OrderInput text="Stop Loss" detail="Lastest" />
        </div>
      </div>
    </div>
  );
}

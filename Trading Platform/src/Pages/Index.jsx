import FuturesMainContent from "../Components/base/FuturesMainContent/FuturesMainContent";
import Header from "../Components/Share/Header/Header";
import Notice from "../Components/Share/Notice/Notice";
import TabTextWrapper from "../Components/Share/Tab/TabTextWrapper";

export default function Index() {
  return (
    <>
      <Header />
      <Notice />
      <FuturesMainContent />
      <div className="p-20">
        <TabTextWrapper />
      </div>
    </>
  );
}

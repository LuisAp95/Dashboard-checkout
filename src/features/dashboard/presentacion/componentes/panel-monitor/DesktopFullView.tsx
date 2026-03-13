import type { FC } from "react";
import { useTypography } from "../../../context/useFontContext";
import type { Data } from "../../../../../features/dashboard/dominio/interfaces/types";
import { ViewCheckout } from "../../../../checkout/presentacion/pages/ViewCheckout";

type Props = {
  data: Data;
};

export const DesktopFullView: FC<Props> = ({ data }) => {
  const { font } = useTypography();

  return (
    <div
      style={{ fontFamily: font }}
      className="w-full h-screen flex justify-center items-center"
    >
      <div className="w-full h-full max-w-[1920px] mx-auto  overflow-auto">
        <div className="overflow-auto h-full">
          <ViewCheckout {...data} />
        </div>
      </div>
    </div>
  );
};

//<div style={{ height: `${height ? height - 24 : "calc(100vh - 24px)"}px` }} className="overflow-auto">

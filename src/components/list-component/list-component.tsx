import * as React from "react";

type ListComponentProps = {
  data: any[];
  renderItem: (item: any) => React.ReactNode;
};

const ListComponent = ({ data, renderItem }: ListComponentProps) => {
  return <>{data.map((item) => renderItem(item))}</>;
};
ListComponent.displayName = "ListComponent";

export { type ListComponentProps, ListComponent };

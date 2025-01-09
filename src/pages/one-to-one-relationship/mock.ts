import { OneToOneRelationshipItem } from "@/components";

const inputItems: OneToOneRelationshipItem[] = [
  {
    value: "input 1",
    label: "input 1 com um texto maior que o normal",
  },
  {
    value: "input 2",
    label: "input 2 com um texto ainda maior superando o tamanho do input 1",
  },
  {
    value: "input 3",
    label: "input 3 um pouco maior",
  },
  {
    value: "input 4",
    label: "input 4",
  },
  {
    value: "input 5",
    label: "input 5",
  },
  {
    value: "input 6",
    label: "input 6",
  },
];

const targetItems: OneToOneRelationshipItem[] = [
  {
    value: "target 1",
    label: "target 1",
  },
  {
    value: "target 2",
    label: "target 2",
  },
  {
    value: "target 3",
    label: "target 3 com um texto maior que o normal",
  },
  {
    value: "target 4",
    label: "target 4 com um texto ainda maior superando o tamanho do target 3",
  },
  {
    value: "target 5",
    label: "target 5",
  },
  {
    value: "target 6",
    label: "target 6",
  },
];

export { inputItems, targetItems };

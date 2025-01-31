import React from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRightLeft, ListRestart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { ListComponent } from "@/components/list-component";

import { cn } from "@/lib/utils";

import { ComponentContext, useComponentContext } from "./hooks";

type OneToOneRelationshipItem = Record<"value" | "label", string>;

type OneToOneRelationshipValue = Record<
  "inputItem" | "targetItem",
  OneToOneRelationshipItem
>;

type OneToOneRelationshipWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  value: OneToOneRelationshipValue[] | null;
  onChange: (value: OneToOneRelationshipValue[] | null) => void;
  disabled?: boolean;
};

const OneToOneRelationshipWrapper = React.forwardRef<
  HTMLDivElement,
  OneToOneRelationshipWrapperProps
>(
  (
    { value, onChange, disabled = false, children, className, ...props },
    ref
  ) => {
    return (
      <ComponentContext.Provider value={{ value, onChange, disabled }}>
        <div
          ref={ref}
          className={cn("flex flex-col gap-4 w-full h-full", className)}
          {...props}
        >
          {children}
        </div>
      </ComponentContext.Provider>
    );
  }
);
OneToOneRelationshipWrapper.displayName = "OneToOneRelationshipWrapper";

type OneToOneRelationshipResetProps = React.ComponentPropsWithoutRef<
  typeof Button
> & { placeholder?: string };

const OneToOneRelationshipReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  OneToOneRelationshipResetProps
>(({ placeholder, className, ...props }, ref) => {
  const { value, onChange, disabled } = useComponentContext();

  return (
    <Button
      ref={ref}
      type="button"
      className={cn("ml-auto", className)}
      variant="outline"
      disabled={value === null || disabled}
      onClick={() => onChange(null)}
      {...props}
    >
      <ListRestart size={16} className="mr-2" />
      <p>{placeholder || "Clear Relations"}</p>
    </Button>
  );
});
OneToOneRelationshipReset.displayName = "OneToOneRelationshipReset";

type OneToOneRelationshipContentProps = React.HTMLAttributes<HTMLDivElement>;

const OneToOneRelationshipContent = React.forwardRef<
  HTMLDivElement,
  OneToOneRelationshipContentProps
>(({ children, className, ...props }, ref) => {
  const { value, onChange } = useComponentContext();

  const handleAddRelation = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const draggableInputValue = active.id as string;
    const draggableInputData = active.data.current as OneToOneRelationshipItem;

    const draggableTargetData = over.data.current as OneToOneRelationshipItem;

    const isAlreadyRelated = value?.find(
      (relation) => relation.inputItem.value === draggableInputValue
    );

    if (isAlreadyRelated) return;

    onChange([
      ...(value || []),
      { inputItem: draggableInputData, targetItem: draggableTargetData },
    ]);
  };

  return (
    <DndContext onDragEnd={handleAddRelation}>
      <div
        ref={ref}
        className={cn("flex gap-4 w-full h-full", className)}
        {...props}
      >
        <Card ref={ref} className="w-2/4 h-full flex p-4 gap-4">
          <ScrollArea className="w-full pr-4">
            <div className="flex gap-4 w-full">{children}</div>
            <ScrollBar forceMount />
          </ScrollArea>
        </Card>
        <OneToOneRelationshipRelatedItems />
      </div>
    </DndContext>
  );
});
OneToOneRelationshipContent.displayName = "OneToOneRelationshipContent";

type OneToOneRelationshipItemsProps = {
  items: OneToOneRelationshipItem[];
} & React.HTMLAttributes<HTMLDivElement>;

const OneToOneRelationshipDraggableItems = React.forwardRef<
  HTMLDivElement,
  OneToOneRelationshipItemsProps
>(({ items, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4 w-1/2", className)}
      {...props}
    >
      <ListComponent
        data={items}
        renderItem={(item) => (
          <OneToOneRelationshipDraggableItem key={item.value} item={item} />
        )}
      />
    </div>
  );
});
OneToOneRelationshipDraggableItems.displayName =
  "OneToOneRelationshipDraggableItems";

const OneToOneRelationshipDroppableItems = React.forwardRef<
  HTMLDivElement,
  OneToOneRelationshipItemsProps
>(({ items, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-4 w-1/2", className)}
      {...props}
    >
      <ListComponent
        data={items}
        renderItem={(item) => (
          <OneToOneRelationshipDroppableItem key={item.value} item={item} />
        )}
      />
    </div>
  );
});
OneToOneRelationshipDroppableItems.displayName =
  "OneToOneRelationshipDroppableItems";

type OneToOneRelationshipItemProps = {
  item: OneToOneRelationshipItem;
};

const OneToOneRelationshipDraggableItem = ({
  item,
}: OneToOneRelationshipItemProps) => {
  const { value, disabled } = useComponentContext();

  const isRelated = value?.some(
    (relation) => relation.inputItem.value === item.value
  );

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.value,
    data: item,
    disabled: isRelated || disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-is-related={isRelated || disabled}
      className={`
          w-full h-min px-4 py-2 
          flex items-center justify-center 
          rounded-md text-sm text-center
          border border-input bg-background select-none
          data-[is-related=true]:bg-secondary
          data-[is-related=true]:text-secondary-foreground
        `}
    >
      {item.label}
    </div>
  );
};

const OneToOneRelationshipDroppableItem = ({
  item,
}: OneToOneRelationshipItemProps) => {
  const { value, disabled } = useComponentContext();

  const isRelated = value?.some(
    (relation) => relation.targetItem.value === item.value
  );

  const { isOver, setNodeRef } = useDroppable({
    id: item.value,
    data: item,
    disabled: isRelated || disabled,
  });

  return (
    <div
      ref={setNodeRef}
      data-is-related={isRelated || disabled}
      data-is-over={isOver}
      className={`
          w-full h-min px-4 py-2 
          flex items-center justify-center 
          rounded-md text-sm
          text-center
          border border-input bg-background select-none
          data-[is-related=true]:bg-secondary
          data-[is-related=true]:text-secondary-foreground
          data-[is-over=true]:bg-secondary
          data-[is-over=true]:text-secondary-foreground
        `}
    >
      {item.label}
    </div>
  );
};

type OneToOneRelationshipRelatedItemProps = {
  item: OneToOneRelationshipValue;
  onRemoveRelation: (targetValue: string) => void;
  disabled?: boolean;
};

const OneToOneRelationshipRelatedItem = ({
  item,
  onRemoveRelation,
  disabled,
}: OneToOneRelationshipRelatedItemProps) => {
  return (
    <div className="flex gap-4 items-center">
      <span
        className={`
          w-full px-4 py-2
          flex gap-2 items-center justify-between
          rounded-md text-sm
          text-center
          border border-input bg-background select-none
        `}
      >
        <p className="w-1/2">{item.inputItem.label}</p>
        <ArrowRightLeft size={14} />
        <p className="w-1/2">{item.targetItem.label}</p>
        <Button
          type="button"
          variant="ghost"
          className="h-8 w-8 rounded-full p-2"
          onClick={() => onRemoveRelation(item.targetItem.value)}
          disabled={disabled}
        >
          <X size={16} />
        </Button>
      </span>
    </div>
  );
};

const OneToOneRelationshipRelatedItems = () => {
  const { value, onChange, disabled } = useComponentContext();

  const handleRemoveRelation = (targetValue: string) => {
    const filtered = value?.filter(
      (relation) => relation.targetItem.value !== targetValue
    );

    onChange(filtered?.length === 0 ? null : filtered || null);
  };

  return (
    <Card className="w-2/4 h-full flex p-4 gap-4">
      <ScrollArea className="w-full pr-4">
        <div className="flex flex-col gap-4 w-full">
          <ListComponent
            data={value || []}
            renderItem={(item) => (
              <OneToOneRelationshipRelatedItem
                key={item.inputItem.value}
                item={item}
                onRemoveRelation={handleRemoveRelation}
                disabled={disabled}
              />
            )}
          />
        </div>
        <ScrollBar forceMount />
      </ScrollArea>
    </Card>
  );
};

export { type OneToOneRelationshipItem, type OneToOneRelationshipValue };
export {
  OneToOneRelationshipWrapper,
  OneToOneRelationshipReset,
  OneToOneRelationshipContent,
  OneToOneRelationshipDraggableItems,
  OneToOneRelationshipDroppableItems,
};

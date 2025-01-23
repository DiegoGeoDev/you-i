import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

import { SinglePointEditor } from "../utils";
import {
  DrawSinglePointOptions,
  DrawSinglePointDrawOptions,
  DrawSinglePointToastOptions,
} from "../draw-single-point";

import { useComponentContext } from "./use-component-context";

const toastId = self.crypto.randomUUID();

type DrawSinglePointProviderProps = {
  children: React.ReactNode;
  pointOptions: DrawSinglePointOptions;
  drawOptions?: DrawSinglePointDrawOptions;
  toastOptions?: DrawSinglePointToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

type DrawSinglePointProviderState = {
  isActive?: boolean;
  handleDrawSinglePoint: () => void;
  handleClearSinglePoint: () => void;
};

const initialState: DrawSinglePointProviderState = {
  isActive: false,
  handleDrawSinglePoint: () => null,
  handleClearSinglePoint: () => null,
};

const DrawSinglePointProviderContext =
  createContext<DrawSinglePointProviderState>(initialState);

function DrawSinglePointProvider({
  children,
  pointOptions,
  drawOptions,
  toastOptions,
  isActive,
  handleActiveChange,
  ...props
}: DrawSinglePointProviderProps) {
  const { map } = useMap();
  const { value, onChange } = useComponentContext();

  const editorRef = useRef<SinglePointEditor>();

  const [internalIsActive, setInternalIsActive] = useState(false);

  const isModify = value !== null;

  // set editorRef
  useEffect(() => {
    if (!map) return;

    editorRef.current = new SinglePointEditor(map, pointOptions, drawOptions);
    editorRef.current.addVectorLayer();

    if (value !== null) {
      editorRef.current.addPoint(value);
      editorRef.current.zoomToVectorLayer();
    }

    return () => {
      onAbortDrawing();
      editorRef.current?.removeVectorLayer();
    };
  }, [map]);

  function onAbortDrawing() {
    editorRef.current?.abortDrawing();

    if (handleActiveChange) {
      handleActiveChange(false);
    }
    setInternalIsActive(false);

    sonnerToast.dismiss(toastId);
  }

  function handleDrawSinglePoint() {
    editorRef.current?.enableDrawing(isModify, onChange, onAbortDrawing);

    if (handleActiveChange) {
      handleActiveChange(true);
    }
    setInternalIsActive(true);

    sonnerToast(toastOptions?.title || "Single Point", {
      id: toastId,
      description:
        toastOptions?.description ||
        'Click on the map to proceed or "Stop Editing"',
      duration: Infinity,
      cancel: (
        <Button className="ml-2" variant="outline" onClick={onAbortDrawing}>
          {toastOptions?.buttonText || "Stop Editing"}
        </Button>
      ),
    });
  }

  function handleClearSinglePoint() {
    editorRef.current?.clearVectorSource(onChange);
  }

  const drawSinglePointvalue = {
    isActive: isActive !== undefined ? isActive : internalIsActive,
    handleDrawSinglePoint,
    handleClearSinglePoint,
  };

  return (
    <DrawSinglePointProviderContext.Provider
      {...props}
      value={drawSinglePointvalue}
    >
      {children}
    </DrawSinglePointProviderContext.Provider>
  );
}

const useDrawSinglePoint = () => {
  const context = useContext(DrawSinglePointProviderContext);
  if (context === undefined)
    throw new Error(
      "useDrawSinglePoint must be used within a DrawSinglePointProvider"
    );
  return context;
};

export { DrawSinglePointProvider, useDrawSinglePoint };

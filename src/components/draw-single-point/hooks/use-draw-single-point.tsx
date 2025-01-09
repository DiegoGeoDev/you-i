import { createContext, useContext, useEffect, useRef } from "react";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

import { SinglePointEditor } from "../utils";
import { DrawSinglePointStyle } from "../draw-single-point";

import { useComponentContext } from "./use-component-context";

const toastId = self.crypto.randomUUID();

type DrawSinglePointProviderProps = {
  children: React.ReactNode;
  mapRef: React.MutableRefObject<null>;
  pointStyle?: DrawSinglePointStyle;
  zIndex: number;
  drawStyle?: DrawSinglePointStyle;
  toastTitle?: string;
  toastDescription?: string;
  toastButtonText?: string;
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
  mapRef,
  pointStyle,
  zIndex,
  drawStyle,
  toastTitle,
  toastDescription,
  toastButtonText,
  isActive,
  handleActiveChange,
  ...props
}: DrawSinglePointProviderProps) {
  const { map } = useMap();
  const { value, onChange } = useComponentContext();

  const editorRef = useRef<SinglePointEditor>();

  const isModify = value !== undefined;

  // abort drawing on click outside mapRef
  // useEffect(() => {
  //   const handleClickOutside = (event: any) => {
  //     // @ts-ignore
  //     if (map && mapRef.current && !mapRef.current.contains(event.target)) {
  //       onAbortDrawing();
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [map, mapRef]);

  // set vectorSourceRef\vectorLayerRef
  useEffect(() => {
    if (!map) return;

    editorRef.current = new SinglePointEditor(
      map,
      zIndex,
      pointStyle,
      drawStyle
    );
    editorRef.current.addVectorLayer();

    if (value !== undefined) {
      editorRef.current.addPoint(value);
    }

    return () => {
      editorRef.current?.removeVectorLayer();
    };
  }, [map]);

  function onAbortDrawing() {
    editorRef.current?.abortDrawing();

    if (handleActiveChange) {
      handleActiveChange(false);
    }
    sonnerToast.dismiss(toastId);
  }

  function handleDrawSinglePoint() {
    editorRef.current?.enableDrawing(isModify, onChange, onAbortDrawing);

    if (handleActiveChange) {
      handleActiveChange(true);
    }

    sonnerToast(toastTitle || "Single Point", {
      id: toastId,
      description:
        toastDescription || 'Click on the map to proceed or "Stop Editing"',
      duration: Infinity,
      cancel: (
        <Button className="ml-2" variant="outline" onClick={onAbortDrawing}>
          {toastButtonText || "Stop Editing"}
        </Button>
      ),
    });
  }

  function handleClearSinglePoint() {
    editorRef.current?.clearVectorSource(onChange);
  }

  const drawSinglePointvalue = {
    isActive,
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

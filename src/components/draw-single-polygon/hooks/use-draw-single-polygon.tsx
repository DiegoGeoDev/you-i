import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

import { SinglePolygonEditor } from "../utils";
import { DrawSinglePolygonStyle } from "../draw-single-polygon";

import { useComponentContext } from "./use-component-context";

const toastId = self.crypto.randomUUID();

type DrawSinglePolygonProviderProps = {
  children: React.ReactNode;
  mapRef: React.MutableRefObject<null>;
  polygonStyle?: DrawSinglePolygonStyle;
  zIndex: number;
  drawStyle?: DrawSinglePolygonStyle;
  toastTitle?: string;
  toastDescription?: string;
  toastButtonText?: string;
};

type DrawSinglePolygonProviderState = {
  isActive: boolean;
  handleDrawSinglePolygon: () => void;
  handleClearSinglePolygon: () => void;
};

const initialState: DrawSinglePolygonProviderState = {
  isActive: false,
  handleDrawSinglePolygon: () => null,
  handleClearSinglePolygon: () => null,
};

const DrawSinglePolygonProviderContext =
  createContext<DrawSinglePolygonProviderState>(initialState);

function DrawSinglePolygonProvider({
  children,
  mapRef,
  polygonStyle,
  zIndex,
  drawStyle,
  toastTitle,
  toastDescription,
  toastButtonText,
  ...props
}: DrawSinglePolygonProviderProps) {
  const { map } = useMap();
  const { value, onChange } = useComponentContext();

  const editorRef = useRef<SinglePolygonEditor>();

  const [isActive, setIsActive] = useState(false);

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

    editorRef.current = new SinglePolygonEditor(
      map,
      zIndex,
      polygonStyle,
      drawStyle
    );
    editorRef.current.addVectorLayer();

    if (value !== undefined) {
      editorRef.current.addPolygon(value);
    }

    return () => {
      editorRef.current?.removeVectorLayer();
    };
  }, [map]);

  function onAbortDrawing() {
    editorRef.current?.abortDrawing();

    setIsActive(false);
    sonnerToast.dismiss(toastId);
  }

  function handleDrawSinglePolygon() {
    editorRef.current?.enableDrawing(isModify, onChange, onAbortDrawing);

    setIsActive(true);

    sonnerToast(toastTitle || "Single Polygon", {
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

  function handleClearSinglePolygon() {
    editorRef.current?.clearVectorSource(onChange);
  }

  const drawSinglePolygonvalue = {
    isActive,
    handleDrawSinglePolygon,
    handleClearSinglePolygon,
  };

  return (
    <DrawSinglePolygonProviderContext.Provider
      {...props}
      value={drawSinglePolygonvalue}
    >
      {children}
    </DrawSinglePolygonProviderContext.Provider>
  );
}

const useDrawSinglePolygon = () => {
  const context = useContext(DrawSinglePolygonProviderContext);
  if (context === undefined)
    throw new Error(
      "useDrawSinglePolygon must be used within a DrawSinglePolygonProvider"
    );
  return context;
};

export { DrawSinglePolygonProvider, useDrawSinglePolygon };

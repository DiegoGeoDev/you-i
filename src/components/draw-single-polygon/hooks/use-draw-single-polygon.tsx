import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

import { SinglePolygonEditor } from "../utils";
import {
  DrawSinglePolygonOptions,
  DrawSinglePolygonDrawOptions,
  DrawSinglePolygonToastOptions,
} from "../draw-single-polygon";

import { useComponentContext } from "./use-component-context";

const toastId = self.crypto.randomUUID();

type DrawSinglePolygonProviderProps = {
  children: React.ReactNode;
  polygonOptions: DrawSinglePolygonOptions;
  drawOptions?: DrawSinglePolygonDrawOptions;
  toastOptions?: DrawSinglePolygonToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

type DrawSinglePolygonProviderState = {
  isActive?: boolean;
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
  polygonOptions,
  drawOptions,
  toastOptions,
  isActive,
  handleActiveChange,
  ...props
}: DrawSinglePolygonProviderProps) {
  const { map } = useMap();
  const { value, onChange } = useComponentContext();

  const editorRef = useRef<SinglePolygonEditor>();

  const [internalIsActive, setInternalIsActive] = useState(false);

  const isModify = value !== null;

  // set editorRef
  useEffect(() => {
    if (!map) return;

    editorRef.current = new SinglePolygonEditor(
      map,
      polygonOptions,
      drawOptions
    );
    editorRef.current.addVectorLayer();

    if (value !== null) {
      editorRef.current.addPolygon(value);
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

  function handleDrawSinglePolygon() {
    editorRef.current?.enableDrawing(isModify, onChange, onAbortDrawing);

    if (handleActiveChange) {
      handleActiveChange(true);
    }
    setInternalIsActive(true);

    sonnerToast(toastOptions?.title || "Single Polygon", {
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

  function handleClearSinglePolygon() {
    editorRef.current?.clearVectorSource(onChange);
  }

  const drawSinglePolygonvalue = {
    isActive: isActive !== undefined ? isActive : internalIsActive,
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

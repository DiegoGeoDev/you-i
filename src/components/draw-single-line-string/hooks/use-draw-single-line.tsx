import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

import { SingleLineStringEditor } from "../utils";
import {
  DrawSingleLineStringOptions,
  DrawSingleLineStringDrawOptions,
  DrawSingleLineStringToastOptions,
} from "../draw-single-line-string";

import { useComponentContext } from "./use-component-context";

const toastId = self.crypto.randomUUID();

type DrawSingleLineStringProviderProps = {
  children: React.ReactNode;
  LineStringOptions: DrawSingleLineStringOptions;
  drawOptions?: DrawSingleLineStringDrawOptions;
  toastOptions?: DrawSingleLineStringToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

type DrawSingleLineStringProviderState = {
  isActive?: boolean;
  handleDrawSingleLineString: () => void;
  handleClearSingleLineString: () => void;
};

const initialState: DrawSingleLineStringProviderState = {
  isActive: false,
  handleDrawSingleLineString: () => null,
  handleClearSingleLineString: () => null,
};

const DrawSingleLineStringProviderContext =
  createContext<DrawSingleLineStringProviderState>(initialState);

function DrawSingleLineStringProvider({
  children,
  LineStringOptions,
  drawOptions,
  toastOptions,
  isActive,
  handleActiveChange,
  ...props
}: DrawSingleLineStringProviderProps) {
  const { map } = useMap();
  const { value, onChange } = useComponentContext();

  const editorRef = useRef<SingleLineStringEditor>();

  const [internalIsActive, setInternalIsActive] = useState(false);

  const isModify = value !== null;

  // set editorRef
  useEffect(() => {
    if (!map) return;

    editorRef.current = new SingleLineStringEditor(
      map,
      LineStringOptions,
      drawOptions
    );
    editorRef.current.addVectorLayer();

    if (value !== null) {
      editorRef.current.addLineString(value);
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

  function handleDrawSingleLineString() {
    editorRef.current?.enableDrawing(isModify, onChange, onAbortDrawing);

    if (handleActiveChange) {
      handleActiveChange(true);
    }
    setInternalIsActive(true);

    sonnerToast(toastOptions?.title || "Single LineString", {
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

  function handleClearSingleLineString() {
    editorRef.current?.clearVectorSource(onChange);
  }

  const drawSingleLineStringvalue = {
    isActive: isActive !== undefined ? isActive : internalIsActive,
    handleDrawSingleLineString,
    handleClearSingleLineString,
  };

  return (
    <DrawSingleLineStringProviderContext.Provider
      {...props}
      value={drawSingleLineStringvalue}
    >
      {children}
    </DrawSingleLineStringProviderContext.Provider>
  );
}

const useDrawSingleLineString = () => {
  const context = useContext(DrawSingleLineStringProviderContext);
  if (context === undefined)
    throw new Error(
      "useDrawSingleLineString must be used within a DrawSingleLineStringProvider"
    );
  return context;
};

export { DrawSingleLineStringProvider, useDrawSingleLineString };

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/app/store/Store";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ForceTermsModal() {
  const { user, url } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only show modal if user is logged in, and they have explicitly NOT accepted the terms.
    if (user && user.terms_accepted === false) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [user]);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${url}/auth/accept-terms`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("No se pudieron aceptar los términos.");
      }

      toast.success("¡Gracias por aceptar las políticas de DEDUCE!");
      
      // We renew session or update state directly
      useAuthStore.getState().userValid();
      
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al guardar tu preferencia. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      // Force modal to stay open if they click outside
    }}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl font-display text-[var(--color-deduce-navy)]">
            Actualización de Políticas
          </DialogTitle>
          <DialogDescription className="pt-2 text-slate-600">
            Hemos actualizado nuestros{" "}
            <Link href="/terminos" target="_blank" className="font-bold text-[var(--color-deduce-teal)] hover:underline">
              Términos y Condiciones
            </Link>{" "}
            y nuestro{" "}
            <Link href="/privacidad" target="_blank" className="font-bold text-[var(--color-deduce-teal)] hover:underline">
              Aviso de Privacidad
            </Link>.
            Para continuar utilizando DEDUCE, necesitamos que revises y aceptes estas nuevas políticas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <Checkbox 
              id="accept-terms-modal" 
              checked={accepted}
              onCheckedChange={(c) => setAccepted(c === true)}
              className="mt-1 border-slate-300 data-[state=checked]:bg-[var(--color-deduce-teal)] data-[state=checked]:border-[var(--color-deduce-teal)]"
            />
            <label htmlFor="accept-terms-modal" className="text-sm text-slate-700 leading-snug cursor-pointer">
              He leído y acepto los nuevos Términos y Condiciones y el Aviso de Privacidad de DEDUCE.
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => useAuthStore.getState().logout()}
            disabled={isLoading}
            className="border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            Cerrar sesión
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!accepted || isLoading}
            className="bg-[var(--color-deduce-navy)] hover:bg-[var(--color-deduce-navy)]/90 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Aceptar y Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

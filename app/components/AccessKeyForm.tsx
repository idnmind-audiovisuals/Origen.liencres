"use client";

import { motion } from "framer-motion";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isAccessDestination,
  type AccessDestination,
} from "../lib/access-types";
import { GATEWAY_MOTION, ORGANIC_EASE } from "../lib/gateway-motion";

type AccessKeyFormProps = {
  visible: boolean;
  disabled: boolean;
  reducedMotion?: boolean;
  onIncorrect: () => void;
  onSuccess: (destination: AccessDestination) => void;
  onFocusChange?: (focused: boolean) => void;
};

export function AccessKeyForm({
  visible,
  disabled,
  reducedMotion = false,
  onIncorrect,
  onSuccess,
  onFocusChange,
}: AccessKeyFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [accessKey, setAccessKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!visible || disabled) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [disabled, visible]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || submitting) return;

    setSubmitting(true);
    setFeedback("");

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: accessKey }),
      });
      const result: unknown = await response.json().catch(() => null);

      if (
        response.ok &&
        typeof result === "object" &&
        result !== null &&
        "destination" in result &&
        isAccessDestination(result.destination)
      ) {
        inputRef.current?.blur();
        onFocusChange?.(false);
        setFeedback("Access accepted. The gateway is opening.");
        onSuccess(result.destination);
        return;
      }

      setAccessKey("");
      setAttempt((current) => current + 1);
      onIncorrect();
      setFeedback(
        response.status === 503
          ? "The gateway is not configured yet."
          : "That key did not open the gateway. Try again.",
      );
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    } catch {
      setFeedback("The gateway could not be reached. Try again.");
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
    } finally {
      setSubmitting(false);
    }
  }

  const motionDuration = reducedMotion
    ? GATEWAY_MOTION.reduced.reveal
    : GATEWAY_MOTION.success.interfaceFade;

  return (
    <motion.form
      className="access-form"
      aria-describedby="access-key-feedback"
      onSubmit={handleSubmit}
      initial={false}
      animate={{
        opacity: visible && !disabled ? 1 : 0,
        x: attempt
          ? [
              0,
              -GATEWAY_MOTION.incorrect.displacement,
              GATEWAY_MOTION.incorrect.displacement,
              -1,
              0,
            ]
          : 0,
      }}
      transition={{
        opacity: { duration: motionDuration, ease: ORGANIC_EASE },
        x: {
          duration: reducedMotion ? 0 : GATEWAY_MOTION.incorrect.duration,
          ease: ORGANIC_EASE,
        },
      }}
      data-attempt={attempt}
    >
      <div className="access-credential">
        <label className="sr-only" htmlFor="origen-access-key">Key to open</label>
        <input
          ref={inputRef}
          id="origen-access-key"
          name="access-key"
          type="password"
          placeholder="Key to open"
          value={accessKey}
          onChange={(event) => setAccessKey(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.nativeEvent.isComposing) return;

            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          aria-invalid={attempt > 0}
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          disabled={disabled || submitting}
        />
      </div>

      <button
        className="access-submit"
        type="submit"
        aria-label="Open Origen"
        disabled={disabled || submitting}
      >
        <span aria-hidden="true" className="submit-breath" />
      </button>

      <p id="access-key-feedback" className="sr-only" role="status" aria-live="polite">
        {feedback}
      </p>
    </motion.form>
  );
}

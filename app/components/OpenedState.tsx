"use client";

type OpenedStateProps = {
  development: boolean;
  onReset?: () => void;
};

export function OpenedState({ development, onReset }: OpenedStateProps) {
  return (
    <main className="opened-state">
      <p role="status">opened</p>
      {development && onReset ? (
        <button className="session-reset" type="button" onClick={onReset}>
          reset session
        </button>
      ) : null}
    </main>
  );
}

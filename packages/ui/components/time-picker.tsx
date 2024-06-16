import React, { useRef } from "react";
import {
  AriaTimeFieldProps,
  TimeValue,
  useDateSegment,
  useLocale,
  useTimeField,
} from "react-aria";
import {
  DateFieldState,
  TimeFieldStateOptions,
  useTimeFieldState,
} from "react-stately";
import { cn } from "../lib";

interface DateSegmentProps {
  segment: any;
  state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: { ...segmentProps },
  } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "focus:rounded-[2px] focus:bg-background-subtle focus:text-foreground-subtle focus:outline-none",
        segment.type !== "literal" && "px-[1px]",
        segment.isPlaceholder && "text-muted-foreground"
      )}
    >
      {segment.text}
    </div>
  );
}

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();

  const state = useTimeFieldState({
    ...props,
    locale,
  });

  const {
    fieldProps: { ...fieldProps },
  } = useTimeField({ ...props, "aria-label": "time-field" }, state, ref);

  return (
    <div className="w-fit relative">
      <div
        {...fieldProps}
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 items-center",
          props.isDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
}

interface TimePickerProps
  extends Omit<TimeFieldStateOptions<TimeValue>, "locale"> {
  showTimezone?: boolean;
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (props, _forwardedRef) => {
    return <TimeField {...props} />;
  }
);

TimePicker.displayName = "TimePicker";

export { TimePicker };

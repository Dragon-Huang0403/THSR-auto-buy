import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

type Option<TValue> = {
  value: TValue;
  label: string;
};

interface SelectProps<
  TValue extends string | number | readonly string[] | undefined
> {
  label?: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: Option<TValue>[];
}

export function Select<
  TValue extends string | number | readonly string[] | undefined
>({ label, value, onChange, options }: SelectProps<TValue>) {
  const currentOption = options.find(
    (option) => option.value === value
  ) as Option<TValue>;
  return (
    <div>
      <Listbox as="div" value={value} onChange={onChange} className="space-y-1">
        {({ open }) => (
          <>
            <Listbox.Label
              className={`block text-sm font-medium leading-5 text-gray-700`}
            >
              {label}
            </Listbox.Label>
            <div className="relative">
              <span className="inline-block w-full rounded-md shadow-sm">
                <Listbox.Button className="focus:shadow-outline-blue relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5">
                  <span className="block truncate">{currentOption.label}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Listbox.Button>
              </span>
              <Transition
                show={open}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
              >
                <Listbox.Options
                  static
                  className="shadow-xs max-h-60 overflow-auto rounded-md py-1 text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
                >
                  {options.map((option) => (
                    <Listbox.Option key={option.label} value={option.value}>
                      {({ selected, active }) => (
                        <div
                          className={`${
                            active ? "bg-blue-600 text-white" : "text-gray-900"
                          } relative cursor-default select-none py-2 pl-8 pr-4`}
                        >
                          <span
                            className={`${
                              selected ? "font-semibold" : "font-normal"
                            } block truncate`}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            <span
                              className={`${
                                active ? "text-white" : "text-blue-600"
                              } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                            >
                              <CheckIcon
                                color="currentColor"
                                className="h-6 w-6"
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
    // <div className="flex">
    //   {label && <div className="basis-24">{label}</div>}
    //   <select
    //     value={value}
    //     onChange={(e) => {
    //       onChange(e.target.value as TValue);
    //     }}
    //   >
    //     {options.map((option) => (
    //       <option
    //         key={option.label}
    //         value={option.value}
    //         label={option.label}
    //       />
    //     ))}
    //   </select>
    // </div>
  );
}

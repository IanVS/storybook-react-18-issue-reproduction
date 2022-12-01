import { useCombobox } from 'downshift';
import { useEffect, useState } from 'react';
import { SelectMenu } from './SelectMenu';

const DEFAULT_PLACEHOLDER = 'Select…';

export function Combobox({
  items,
  label,
  disabled,
  onBlur,
  errorMessage,
  placeholder = DEFAULT_PLACEHOLDER,
  itemToString = defaultItemToString,
  className,
  ...props
}) {
  const [shownItems, setShownItems] = useState(items);
  const [isOpenByFocus, setIsOpenByFocus] = useState(false);
  const [initialItems, setInitialItems] = useState(items);

  if (typeof props.initialSelectedItem === 'undefined') delete props.initialSelectedItem;
  if (typeof props.getA11yStatusMessage === 'undefined') delete props.getA11yStatusMessage;

  const cb = useCombobox({
    items: shownItems,
    onInputValueChange: ({ inputValue }) => {
      // If the input is cleared, show all items
      if (!inputValue) {
        setShownItems(items);
        return;
      }

      // Filter items to show
      setShownItems(items.filter((item) => itemToString(item).toLowerCase().includes(inputValue.toLowerCase())));
    },
    ...props,
  });

  console.log({cb})

  const {
    isOpen,
    openMenu,
    toggleMenu,
    selectedItem,
    getInputProps,
    getLabelProps,
    getMenuProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = cb

  // Reset the internal select box state if items are added and we have a defaultSelectedItem.
  // This is needed for SelectAsync to show a default value when items load in asynchronously.
  useEffect(() => {
    if (!initialItems.length && items.length && props.defaultSelectedItem) {
      reset();
      setInitialItems(items);
    }
  }, [initialItems, items, reset, props.defaultSelectedItem]);

  return (
      <div {...getComboboxProps()}>
        <label {...getLabelProps()}>{label}
        <input
          {...getInputProps({
            disabled,
            onBlur,
            onFocus: () => {
              // Input re-focuses after an item is selected, and we don't want to re-open the menu
              // https://github.com/downshift-js/downshift/issues/1095#issuecomment-647689993
              if (!isOpen) {
                setIsOpenByFocus(true);
                openMenu();
              }
            },
            onClick: () => {
              if (isOpenByFocus) {
                setIsOpenByFocus(false);
              } else {
                toggleMenu();
              }
            },
            placeholder,
          })}
          hasError={Boolean(errorMessage)}
          isMenuOpen={isOpen}
        />
        <SelectMenu
          {...{
            items: shownItems,
            isOpen,
            getItemProps,
            getMenuProps,
            selectedItem,
            highlightedIndex,
            itemToString,
          }}
        />
        </label>
        
      </div>
  );
}

function defaultItemToString(item) {
  if (!item) return '';

  return String(item);
}

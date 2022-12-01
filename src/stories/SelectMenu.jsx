import { createPortal } from 'react-dom';


export function SelectMenu({
  items,
  isOpen,
  getMenuProps,
  renderMenuItem = (item) => String(item),
  itemToString,
  noItemsMessage = 'No options found',
}) {
  return createPortal(
    <ul
      {...getMenuProps()}
      style={{display: isOpen ? 'block' : 'none', backgroundColor: 'white'}}
    >
      {isOpen &&
          (items.length ? (
            items.map((item, index) => (
              <div
                style={{backgroundColor: 'white'}}
                key={`${itemToString(item)}`}
              >
                {renderMenuItem(item, index)}
              </div>
            ))
          ) : (
            <div>{noItemsMessage}</div>
          ))
      }
    </ul>,
    document.body
  );
}

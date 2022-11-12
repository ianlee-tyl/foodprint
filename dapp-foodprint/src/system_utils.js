function absorbEvent_(event) {
  var e = event || window.event;
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  return false;
}

export function preventLongPressMenu(node) {
  window.oncontextmenu = absorbEvent_;
}

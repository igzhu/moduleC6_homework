const btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
  width_txt = window.screen.width;
  height_txt = window.screen.height;
  txt =`Размеры экрана:\n
        ширина - ${width_txt}px.\n
        высота - ${height_txt}px.`;
  window.alert(txt);
});
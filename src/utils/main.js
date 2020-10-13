const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
const destroy = (el) => {
    document.body.removeChild(document.querySelector(`.${el}`));
}
export default {
    capitalize,
    destroy
}
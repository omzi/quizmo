export const convertToEntity = text => {
  const entities = { nbsp: ' ', cent: '¢', pound: '£', yen: '¥', euro: '€', copy: '©', reg: '®', lt: '<', gt: '>', hellip: '…', ldquo: '“', rdquo: '”', rsquo: '’', lsquo: '‘', quot: '"', amp: '&', apos: '\'', shy: '­' }
  return text.replace(/\&([^;]+);/g, (entity, entityCode) => {
    let match;
    if (entityCode in entities) {
        return entities[entityCode];
    } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
        return String.fromCharCode(parseInt(match[+!![]], 16));
    } else if (match = entityCode.match(/^#(\d+)$/)) {
        return String.fromCharCode(~~match[+!![]]);
    } else {
        return entity;
    }
  });
}

export const shuffleArray = array => array.sort(() => Math.random() - 0.5);
   
export const shuffleProperties = object => {
  const keys = Object.keys(object).sort(() => Math.random() - 0.5);

  return keys.reduce((newObject, property) => {
    newObject[property] = object[property];
    return newObject;
  }, {});
}

// const shuffleProperties = object => {
//   return Object.fromEntries(
//     Object.entries(object).sort(([,property],[,value]) => Math.random() - 0.5)
//   )
// }

export const incrementValue = (value, oldValue, element, interval, delay) => {
  setTimeout(() => {
    let timer = setInterval(() => {
      oldValue === value && clearInterval(timer);
      element.innerText = oldValue;
      oldValue++;
    }, interval)
  }, delay)
}

export const fade = (element, direction, isRemoveElement = false, display, callback) => {
  direction = direction.toLowerCase();
  if (!['in', 'out'].includes(direction)) return console.warn('Invalid fade direction!');
  
  let opacity = direction === 'out' ? 1 : 0.05,
      count = +(!![]+!![]+!![]+[+[]]),
      timer = setInterval(() => {
        if (direction === 'out') {
          opacity -= 0.1 * opacity, element.style.opacity = opacity;
          opacity <= 0.05 && (isRemoveElement ? element.remove() : element.style.display = 'none', clearInterval(timer), callback && callback());
        } else {
          count--, element.style.display = display;
          opacity = 0.9 ** count, element.style.opacity = opacity;
          opacity === 1 && (clearInterval(timer), callback && callback());
        }
      }, 35)
}

export const toggleDarkMode = e => {
  
}
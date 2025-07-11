const translations = {
	en: {
	greet: "Hello",
	intro: "Welcome to our website"
},
	fr: {
		greet: "Bonjour",
		intro: "Bienvenue sur notre site web"
	}
};

const language = "fr"; // Change to "en" for English
const greeting = "greet";
const introduction = "intro";

const localizedGreeting = localize`${greeting}`;
const localizedIntroduction = localize`${introduction}`;

console.log(localizedGreeting); // Expected: "Bonjour" (for language "fr")
console.log(localizedIntroduction); // Expected: "Bienvenue sur notre site web" (for language "fr")

function localize(strings, ...keys) {
    const lang = translations[language];
    return keys.map(key => lang[key]).join(' ');
}   


//TASK 2 

const keywords = ["JavaScript", "template", "tagged"];
const template = "Learn \${0} tagged templates to create custom \${1} literals for \${2} manipulation.";

const highlighted = highlightKeywords(template, keywords);

console.log(highlighted);
// Expected: "Learn <span class='highlight'>JavaScript</span> tagged templates to create custom <span class='highlight'>template</span> literals for <span class='highlight'>tagged</span> manipulation."

function highlightKeywords(template, keywords) {
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    return template.replace(regex, "<span class='highlight'>$1</span>");
}
console.log(highlightKeywords("JavaScript is great", ["JavaScript", "great"])); // Expected: "<span class='highlight'>JavaScript</span> is <span class='highlight'>great</span>"        



//task3

function multiline(strings, ...values) {
  // Unimos el string completo (por si hay interpolaciones, aunque no se usan en este ejemplo)
  const fullText = strings.reduce((result, str, i) => result + str + (values[i] || ""), "");

  // Dividimos el texto en líneas
  const lines = fullText.split('\n');

  const numbered = lines.map((line, index) => {
    // Usamos padStart para alinear los números si fueran más de 9 líneas
    return `${(index + 1).toString().padStart(2)} ${line}`;
  });

  // Unimos de nuevo todo en un solo string
  return numbered.join('\n');
}
const code = multiline`function add(a, b) {
  return a + b;
}
`;

console.log(code);

//task 4 

function debounce(func, delay){
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      }  
}

function debouncedSearch(query) {
	// Perform search operation with the query
	console.log("Searching for:", query);
}

const debouncedSearchHandler = debounce(debouncedSearch, 300);
 window.addEventListener("DOMContentLoaded", () => {
      const inputElement = document.getElementById("search-input");
      inputElement.addEventListener("input", event => {
        debouncedSearchHandler(event.target.value);
      });
    });

//task 5


function throttle(func, interval) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

function onScroll(event) {
  console.log("Scroll detectado:", new Date().toLocaleTimeString());
}

const throttledScrollHandler = throttle(onScroll, 1000); 

window.addEventListener("scroll", throttledScrollHandler);


//task6


function curry(func, arity){
  arity = arity || func.length;
  return function curried(...args) {
    if (args.length >= arity) {
      return func.apply(this, args);
    }
    return function(...nextArgs) {
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

function multiply(a, b, c) {
	return a * b * c;
}

const curriedMultiply = curry(multiply, 3);

const step1 = curriedMultiply(2); // Returns a curried function
const step2 = step1(3); // Returns a curried function
const result = step2(4); // Returns the final result: 2 * 3 * 4 = 24

console.log("Result:", result); // Expected: 24



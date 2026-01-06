document.addEventListener("DOMContentLoaded", () => {
    // Initialize SplitType for the menu links
    if (typeof SplitType === 'undefined') {
        console.error("SplitType is not defined. Make sure the script is loaded.");
        return;
    }

    // Split text for both links and the new spans
    const mySplitText = new SplitType(".menu-left-item, .menu-item span", { types: "words, chars" });

    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item) => {
        const linkElement = item.querySelector(".menu-left-item");
        const bgHover = item.querySelector(".bg-hover");
        const spanElement = item.querySelector("span");

        if (linkElement && bgHover) {
            // Set the width of the background hover element
            setTimeout(() => {
                const width = linkElement.offsetWidth;
                bgHover.style.width = (width + 50) + "px"; // Increased padding for visual balance

                // Position the span to the right of the link
                if (spanElement) {
                    spanElement.style.left = (width + 70) + "px"; // 50px padding + 20px gap
                }
            }, 100);

            // Store the original text content for both link and span
            const linkChars = linkElement.querySelectorAll(".char");
            const spanChars = spanElement ? spanElement.querySelectorAll(".char") : [];

            // Helper to get text from NodeList
            const getOriginalText = (nodelist) => [...nodelist].map(c => c.textContent);

            const originalLinkText = getOriginalText(linkChars);
            const originalSpanText = spanElement ? getOriginalText(spanChars) : [];

            let shuffleIntervals = [];
            let resetTimeouts = [];

            // Mouse enter event
            linkElement.addEventListener("mouseenter", () => {
                // Clear any existing intervals/timeouts
                clearAllIntervals();

                // --- Animate Link ---
                // Get fresh chars in case of re-renders (though split type usually static here)
                const currentLinkChars = linkElement.querySelectorAll(".char");
                animateChars(currentLinkChars, originalLinkText);

                // --- Animate Span (Page Number) ---
                if (spanElement) {
                    const currentSpanChars = spanElement.querySelectorAll(".char");
                    animateChars(currentSpanChars, originalSpanText);
                    // Also make span white on hover
                    spanElement.style.color = "#fff";
                }
            });

            // Mouse leave event
            linkElement.addEventListener("mouseleave", () => {
                clearAllIntervals();

                // Restore text immediately (or quickly)
                setTimeout(() => {
                    restoreChars(linkElement, originalLinkText);
                    if (spanElement) {
                        restoreChars(spanElement, originalSpanText);
                        spanElement.style.color = ""; // Revert color
                    }
                }, 50);
            });

            function animateChars(charsNodeList, originalTextArr) {
                charsNodeList.forEach((char, index) => {
                    // Stagger start
                    const resetTimeout = setTimeout(() => {
                        // Shuffle loop
                        const interval = setInterval(() => {
                            char.textContent = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        }, 10);

                        shuffleIntervals.push(interval);

                        // Stop shuffling
                        const stopTimeout = setTimeout(() => {
                            clearInterval(interval);
                            char.textContent = originalTextArr[index];
                        }, 75);

                        resetTimeouts.push(stopTimeout);

                    }, index * 20);

                    resetTimeouts.push(resetTimeout);
                });
            }

            function restoreChars(element, originalTextArr) {
                const chars = element.querySelectorAll(".char");
                chars.forEach((char, index) => {
                    char.textContent = originalTextArr[index];
                });
            }

            // Helper function to clear all intervals and timeouts
            function clearAllIntervals() {
                shuffleIntervals.forEach(interval => clearInterval(interval));
                resetTimeouts.forEach(timeout => clearTimeout(timeout));
                shuffleIntervals = [];
                resetTimeouts = [];
            }
        }
    });
});

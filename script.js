let toxicityModel;

        // Toxicity Classifier model
        async function loadToxicityModel() {
            try {
                console.log("Loading toxicity model...");
                const threshold = 0.9; // Confidence threshold for predictions
                toxicityModel = await toxicity.load(threshold);
                console.log("Toxicity model loaded successfully.");
                document.querySelector("button").disabled = false; // Enable button after loading
            } catch (error) {
                console.error("Error loading toxicity model:", error);
            }
        }

        loadToxicityModel();

        async function evaluateComment() {
            const comment = document.getElementById("comment").value.trim();
            const output = document.getElementById("output");

            if (!comment) {
                output.textContent = "Please enter a comment.";
                output.className = "output";
                return;
            }

            if (!toxicityModel) {
                output.textContent = "Toxicity model is not loaded yet. Please try again later.";
                output.className = "output";
                return;
            }

            try {
                // Evaluate comment using the toxicity model
                const predictions = await toxicityModel.classify([comment]);
                const toxicPredictions = predictions.filter(p => p.results[0].match);

                if (toxicPredictions.length > 0) {
                    const labels = toxicPredictions.map(p => p.label.replace("_", " ")).join(", ");
                    output.textContent = `This comment is toxic (${labels}).`;
                    output.className = "output toxic";
                } else {
                    output.textContent = "This comment is Healthy.";
                    output.className = "output healthy";
                }
            } catch (error) {
                console.error("Error during evaluation:", error);
                output.textContent = "An error occurred while evaluating the comment.";
                output.className = "output";
            }
        }
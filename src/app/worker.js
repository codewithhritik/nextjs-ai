import { pipeline, env } from "@xenova/transformers";

// Assuming @xenova/transformers or its dependencies might be trying to access `window`
// We check for `self` being defined, which indicates we're in a Worker context
if (typeof self !== 'undefined') {
    // Skip local model check
    env.allowLocalModels = false;

    // Use the Singleton pattern to enable lazy construction of the pipeline.
    class PipelineSingleton {
        static task = 'text-classification';
        static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
        static instance = null;

        static async getInstance(progress_callback = null) {
            if (this.instance === null) {
                this.instance = pipeline(this.task, this.model, { progress_callback });
            }
            return this.instance;
        }
    }

    // Listen for messages from the main thread
    self.addEventListener('message', async (event) => {
        let classifier = await PipelineSingleton.getInstance(x => {
            // Track model loading.
            self.postMessage(x);
        });

        let output = await classifier(event.data.text);

        self.postMessage({
            status: 'complete',
            output: output,
        });
    });
}
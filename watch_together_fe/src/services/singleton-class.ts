// TODO correct the generic type use and extend all the services from this class

function Singleton<T>(target: new () => T) {

    class Singleton {
        static instance: T | null = null;

        static getInstance = (): T => {
            if (!this.instance) {
                this.instance = new target();
            }

            return this.instance;
        };
    }

    return Singleton;
}

export default Singleton;
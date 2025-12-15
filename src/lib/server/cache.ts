interface CacheEntry<T> {
	data: T;
	expires: number;
}

class Cache {
	private store = new Map<string, CacheEntry<any>>();

	async get<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 60000): Promise<T> {
		const cached = this.store.get(key);

		if (cached && Date.now() < cached.expires) {
			return cached.data;
		}

		const data = await fetchFn();
		this.store.set(key, {
			data,
			expires: Date.now() + ttl
		});

		this.cleanup();
		return data;
	}

	private cleanup() {
		const now = Date.now();
		for (const [key, value] of this.store.entries()) {
			if (now > value.expires) {
				this.store.delete(key);
			}
		}
	}

	clear(key?: string) {
		if (key) {
			this.store.delete(key);
		} else {
			this.store.clear();
		}
	}
}

export const cache = new Cache();

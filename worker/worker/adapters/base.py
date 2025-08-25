from pathlib import Path
from hashlib import md5, sha256, sha1

ROOT_PATH = Path(__file__).resolve().parents[2]
DEFAULT_CACHE_DIR = ROOT_PATH / "worker" / "models"
DEFAULT_CACHE_DIR.mkdir(parents=True, exist_ok=True)


class BaseAdapters:

    def __init__(self, name, version, size, checksum, cache_dir=None):
        self.name = name
        self.version = version
        self.size = size
        self.checksum = checksum.strip().lower()
        self.cache_dir = Path(cache_dir) if cache_dir else DEFAULT_CACHE_DIR

    def get_model_path(self):
        """Return path where this model should be stored"""
        return self.cache_dir / f"{self.name}-{self.version}"

    def download_model(self):
        """Download the model to the cache directory"""
        raise NotImplementedError("This method should be implemented by subclasses.")

    def load_model(self):
        """Load the model from the cache directory"""
        raise NotImplementedError("This method should be implemented by subclasses.")

    def checksum(self):
        """Verify checksum of the model file against expected value"""
        model_path = self.get_model_path()

        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found at {model_path}")

        algo = None
        if len(self.checksum) == 32:
            algo = md5
        elif len(self.checksum) == 40:
            algo = sha1
        elif len(self.checksum) == 64:
            algo = sha256
        else:
            raise ValueError("Unknown checksum format. Supported: MD5, SHA1, SHA256")

        hasher = algo()

        with open(model_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                hasher.update(chunk)

        computed_checksum = hasher.hexdigest()

        return computed_checksum == self.checksum

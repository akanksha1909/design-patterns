class ValidationService {
    validate(fileName: String, size: number): void {
        if (size > 10 * 1024 * 1024) {
            throw new Error("File size exceeds limit");
        }

        if (!fileName.endsWith(".csv") && !fileName.endsWith(".json")) {
            throw new Error("Unsupported file format");
        }
    }
}

export const validationService = new ValidationService();
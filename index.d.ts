declare module 'libprojectutils' {
    /**
     * Bumps the version (major, minor or patch). `@since` metadata are preserved.
     */
    export function bump(version: string, type: "major" | "minor" | "patch")

    /**
     * Utility function to bump a version without filesystem operations.
     */
    export function incrementVersion(version: string, type: "major" | "minor" | "patch")

    /**
     * Sets the version to the inputted version.
     */
    export function setVersion(version: string)
}
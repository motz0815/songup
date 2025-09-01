const toastKeyMap: { [key: string]: string[] } = {
    success: ["success", "success_description"],
    info: ["info", "info_description"],
    warning: ["warning", "warning_description"],
    error: ["error", "error_description"],
}

const getToastRedirect = (
    path: string,
    toastType: string,
    toastName: string,
    toastDescription: string = "",
    arbitraryParams: string = "",
): string => {
    const [nameKey, descriptionKey] = toastKeyMap[toastType]

    let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`

    if (toastDescription) {
        redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`
    }

    if (arbitraryParams) {
        redirectPath += `&${arbitraryParams}`
    }

    return redirectPath
}

export const getSuccessRedirect = (
    path: string,
    successName: string,
    successDescription: string = "",
    arbitraryParams: string = "",
) =>
    getToastRedirect(
        path,
        "success",
        successName,
        successDescription,
        arbitraryParams,
    )

export const getErrorRedirect = (
    path: string,
    errorName: string,
    errorDescription: string = "",
    arbitraryParams: string = "",
) =>
    getToastRedirect(
        path,
        "error",
        errorName,
        errorDescription,
        arbitraryParams,
    )

export const getInfoRedirect = (
    path: string,
    infoName: string,
    infoDescription: string = "",
    arbitraryParams: string = "",
) => getToastRedirect(path, "info", infoName, infoDescription, arbitraryParams)

export const getWarningRedirect = (
    path: string,
    warningName: string,
    warningDescription: string = "",
    arbitraryParams: string = "",
) =>
    getToastRedirect(
        path,
        "warning",
        warningName,
        warningDescription,
        arbitraryParams,
    )

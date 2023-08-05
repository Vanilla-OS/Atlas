function getModuleTypeClass(type: string) {
    switch (type) {
        case "shell":
            return "terminal";

        case "apt":
            return "inventory_2";
        case "dpkg":
            return "inventory_2";
        case "dnf":
            return "inventory_2";
        case "rpm":
            return "inventory_2";
        case "yum":
            return "inventory_2";

        case "dpkg-buildpackage":
            return "home_repair_service";
        case "rpm-build":
            return "home_repair_service";

        case "cmake":
            return "build";
        case "go":
            return "build";
        case "meson":
            return "build";

        default:
            return "extension";
    }
}

export default {
    getModuleTypeClass
}
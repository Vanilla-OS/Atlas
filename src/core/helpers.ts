function getModuleTypeClass(type: string) {
    switch (type) {
        case "shell":
            return "terminal";

        case "apt":
        case "dpkg":
        case "dnf":
        case "rpm":
        case "yum":
            return "inventory_2";

        case "dpkg-buildpackage":
        case "rpm-build":
            return "home_repair_service";

        case "includes":
            return "folder";

        case "cmake":
        case "go":
        case "meson":
            return "build";

        case "fsguard":
            return "security";

        default:
            return "extension";
    }
}

function getModuleTypeColors(type: string) {
    switch (type) {
        case "shell":
            return "bg-green-100 text-green-800";

        case "apt":
        case "dpkg":
        case "dnf":
        case "rpm":
        case "yum":
            return "bg-amber-100 text-amber-800";

        case "dpkg-buildpackage":
        case "rpm-build":
            return "bg-orange-100 text-orange-800";

        case "includes":
            return "bg-yellow-100 text-yellow-800";

        case "cmake":
            return "bg-red-100 text-red-800";
        case "go":
            return "bg-cyan-100 text-cyan-800";
        case "meson":
            return "bg-blue-100 text-blue-800";

        case "fsguard":
            return "bg-purple-100 text-purple-800";

        default:
            return "bg-gray-100 text-gray-800";
    }
}

export default {
    getModuleTypeClass,
    getModuleTypeColors
}

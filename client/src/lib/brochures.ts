export const projectBrochures: Record<
  string,
  { href: string; download: string; label?: string }
> = {
  Vanam: {
    href: "/brochures/vanam-brochure.pdf",
    download: "VANAM-Premium-Brochure-Property-Path.pdf",
    label: "Download VANAM Brochure",
  },
  Naturaleza: {
    href: "/brochures/naturaleza-brochure.pdf",
    download: "TRAYEE-Naturaleza-Brochure.pdf",
  },
  Mirana: {
    href: "/brochures/mirana-brochure.pdf",
    download: "Mirana-Project-Brochure.pdf",
  },
  TerraGenesis: {
    href: "/images/avasa-blueprint.jpg",
    download: "Avasa-Site-Layout.jpg",
    label: "Download Site Layout",
  },
};

export function downloadProjectBrochure(projectName: string) {
  const brochure = projectBrochures[projectName];
  if (!brochure) return false;

  const link = document.createElement("a");
  link.href = brochure.href;
  link.download = brochure.download;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

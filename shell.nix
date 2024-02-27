{ pkgs ? import <nixpkgs> {},   }:

pkgs.mkShell {
  packages = with pkgs; [

    # keep this line if you use bash
    bashInteractive

    nodejs_20
    deno

    nodePackages.pnpm
    nodePackages.node2nix
#    nodePackages.netlify-cli
  
];
      # Dependencies that should exist in the runtime environment
      #buildInputs = packages;
      # Dependencies that should only exist in the build environment
      #nativeBuildInputs = [ pkgs.makeWrapper ];

#        shellHook = ''
#        echo "node `${pkgs.nodejs}/bin/node --version`"
#      '';
}

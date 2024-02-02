{
  description = "A very basic flake";
/*
  inputs = {
    # this is equivalent to `nixpkgs = { url = "..."; };`
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";

  };
  outputs = inputs: {
    packages."x86_64-linux".default = derivation {
      name = "simple";
      builder = "${inputs.nixpkgs.legacyPackages."x86_64-linux".bash}/bin/bash";
      args = [ "-c" "echo foo > $out" ];
      src = ./.;
      system = "x86_64-linux";
    };
  };
 */
  outputs = { self, nixpkgs }: {

    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;

  };
  
}

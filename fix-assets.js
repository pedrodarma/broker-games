// fix-assets.js
import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const nodeModulesDir = path.join(distDir, 'assets', 'node_modules');
const fontsDestDir = path.join(distDir, 'assets', 'fonts');

if (fs.existsSync(nodeModulesDir)) {
	fs.mkdirSync(fontsDestDir, { recursive: true });

	// Copia todas as fontes .ttf que o Metro colocou lá
	function copyFonts(dir) {
		for (const file of fs.readdirSync(dir)) {
			const full = path.join(dir, file);
			const stat = fs.statSync(full);
			if (stat.isDirectory()) copyFonts(full);
			else if (file.endsWith('.ttf')) {
				fs.copyFileSync(full, path.join(fontsDestDir, file));
			}
		}
	}

	copyFonts(nodeModulesDir);

	// Remove a pasta proibida
	fs.rmSync(nodeModulesDir, { recursive: true, force: true });

	// Corrige os caminhos dentro dos JS gerados
	function fixPaths(dir) {
		for (const file of fs.readdirSync(dir)) {
			const full = path.join(dir, file);
			const stat = fs.statSync(full);
			if (stat.isDirectory()) fixPaths(full);
			else if (file.endsWith('.js')) {
				let content = fs.readFileSync(full, 'utf8');
				content = content.replace(
					/\/assets\/node_modules\/[^"']+\/Fonts\//g,
					'/assets/fonts/',
				);
				fs.writeFileSync(full, content, 'utf8');
			}
		}
	}

	fixPaths(distDir);

	console.log('✅ Fontes movidas para /assets/fonts e caminhos corrigidos!');
} else {
	console.log(
		'ℹ️ Nenhuma pasta assets/node_modules encontrada — nada a corrigir.',
	);
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $empresas = [
            [
                'nombre' => 'Tech Solutions S.L.',
                'cif' => 'B12345678',
                'direccion' => 'Calle Mayor 123, 28001 Madrid, España',
                'imagen' => 'https://via.placeholder.com/300x200/0066cc/ffffff?text=Tech+Solutions',
                'description' => 'Empresa líder en soluciones tecnológicas para pequeñas y medianas empresas. Especializada en desarrollo de software, consultoría IT y servicios en la nube.'
            ],
            [
                'nombre' => 'Innovación Digital S.A.',
                'cif' => 'A87654321',
                'direccion' => 'Avenida Tecnología 456, 08001 Barcelona, España',
                'imagen' => 'https://via.placeholder.com/300x200/00cc66/ffffff?text=Innovacion+Digital',
                'description' => 'Compañía especializada en transformación digital e innovación tecnológica. Ofrece servicios de consultoría estratégica, desarrollo de productos digitales y marketing online.'
            ],
            [
                'nombre' => 'Consultoría Empresarial',
                'cif' => 'B11223344',
                'direccion' => 'Plaza de España 789, 41001 Sevilla, España',
                'imagen' => 'https://via.placeholder.com/300x200/cc6600/ffffff?text=Consultoria',
                'description' => 'Firma de consultoría empresarial con más de 15 años de experiencia. Especializada en asesoramiento financiero, recursos humanos y optimización de procesos de negocio.'
            ]
        ];

        foreach ($empresas as $empresaData) {
            if (!Empresa::where('cif', $empresaData['cif'])->exists()) {
                Empresa::create($empresaData);
            }
        }
    }
}

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-06-2025 a las 00:35:55
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `api_anab`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('empleado','administrador') NOT NULL DEFAULT 'empleado',
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `name`, `email`, `password`, `rol`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Administrador Principal', 'admin@empleado.com', '$2y$12$yrVSYSqWCumu.C2fGmgtS.cQBAPXCeKICTySgnhACnHJ.i6xZ8J.e', 'administrador', 'empleados/ydBNnaHD4sh37sTrXzGypVSTpMUSlkqiJznbwzA9.jpg', '2025-06-09 06:05:44', '2025-06-09 06:23:14'),
(2, 'Juan Pérez', 'juan@rmg.com', '$2y$12$e3Sge25FCxNtyLB8jx25nODwc.4LXm.mmyF8Gt14XsUde0sUmJdRm', 'empleado', 'empleados/W5a1qWg3475pkz89kRDB3MaxhIg8s8Qhw5BhzcRH.png', '2025-06-09 06:05:44', '2025-06-09 06:23:29'),
(3, 'Empleado Nuevo', 'nuevo1@excon.com', '$2y$12$K/5VfVZbmI7rN8LGY3eQCuEAHRGYRU.7gja6BFoQ2pIEm30MUn3aK', 'empleado', 'empleados/tUj8XKZ5Wp4hVXTCNR3MMaq25W9vHt4H1PAFew5w.png', '2025-06-09 06:05:44', '2025-06-09 11:40:54'),
(4, 'María García', 'maria@aridos.com', '$2y$12$PaEljUhNfEI659fOFH8l3.akaOEtqMxnTbNtAZlTLc1jYIYb6k4cu', 'empleado', 'empleados/w57nppc78bR19FUJPpL97Hpw8PuF9WOnCubcKnCj.png', '2025-06-09 06:05:44', '2025-06-09 11:41:44'),
(6, 'Oscar Sanchez Avellan', 'oscar.sanchez.avellan@rmg.com', '$2y$12$xjNoWbCTORJQx3N.e2H5tu4NDxiDxRHR9OA3t6OQ45gt13Avj7jxG', 'empleado', 'empleados/dIV9fedl5AWyu8WRuDoYbxkTQv4a2FsLY2w5VbwH.png', '2025-06-09 07:34:42', '2025-06-09 08:30:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id_empresa` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cif` varchar(9) NOT NULL,
  `direccion` text NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id_empresa`, `nombre`, `cif`, `direccion`, `imagen`, `description`, `created_at`, `updated_at`) VALUES
(1, 'EXCON', 'B12345678', 'Calle Mayor 123, 28001 Madrid, España', 'empresas/9VvtriPQOeGHYeWrihhJeLPyNq9ro6o6VsCdY541.png', 'Empresa líder en soluciones tecnológicas para pequeñas y medianas empresas. Especializada en desarrollo de software, consultoría IT y servicios en la nube.', '2025-06-09 06:05:44', '2025-06-09 06:20:19'),
(2, 'RMG', 'A87654321', 'Avenida Tecnología 456, 08001 Barcelona, España', 'empresas/ynH8Y5tcikKy2VfrWzA78aTIld0lHRQTIOmT8VD0.png', 'Compañía especializada en transformación digital e innovación tecnológica. Ofrece servicios de consultoría estratégica, desarrollo de productos digitales y marketing online.', '2025-06-09 06:05:44', '2025-06-09 06:20:37'),
(3, 'ARIDOS', 'B11223344', 'Plaza de España 789, 41001 Sevilla, España', 'empresas/lFkJWijtEGPMJ1MNqKUydc5CDCokEInmHInKqphN.png', 'Firma de consultoría empresarial con más de 15 años de experiencia. Especializada en asesoramiento financiero, recursos humanos y optimización de procesos de negocio.', '2025-06-09 06:05:44', '2025-06-09 06:20:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios`
--

CREATE TABLE `horarios` (
  `id_horario` bigint(20) UNSIGNED NOT NULL,
  `id_empleado` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `estado` enum('pendiente','aceptado','rechazado') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `horarios`
--

INSERT INTO `horarios` (`id_horario`, `id_empleado`, `fecha`, `hora_inicio`, `hora_fin`, `estado`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-06-09', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(2, 2, '2025-06-13', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(3, 2, '2025-06-11', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(4, 2, '2025-06-12', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(5, 2, '2025-06-10', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(6, 1, '2025-06-10', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(7, 3, '2025-06-12', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(8, 4, '2025-06-09', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34'),
(9, 2, '2025-06-24', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-09 07:24:09'),
(10, 2, '2025-06-25', '08:00:00', '16:00:00', 'rechazado', '2025-06-08 08:10:34', '2025-06-09 07:24:14'),
(11, 1, '2025-06-27', '08:00:00', '16:00:00', 'rechazado', '2025-06-09 07:24:49', '2025-06-09 07:25:00'),
(12, 6, '2025-06-12', '08:00:00', '16:00:00', 'aceptado', '2025-06-08 08:10:34', '2025-06-08 08:10:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_08_19_000000_create_failed_jobs_table', 1),
(2, '2019_12_14_000001_create_password_reset_tokens_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2025_05_23_120000_create_empresas_table', 1),
(5, '2025_05_23_120001_create_empleados_table', 1),
(6, '2025_05_23_120002_create_notificaciones_table', 1),
(7, '2025_05_23_120003_create_nominas_table', 1),
(8, '2025_05_23_120004_create_horarios_table', 1),
(9, '2025_05_23_120005_create_vacaciones_table', 1),
(10, '2025_06_04_200000_add_imagen_to_empresas_table', 1),
(11, '2025_06_05_100000_add_description_to_empresas_table', 1),
(12, '2025_06_05_110000_add_image_to_empleados_table', 1),
(13, '2025_06_05_120000_add_estado_to_horarios_table', 1),
(14, '2025_06_05_120001_add_estado_to_horarios_table_fix', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nominas`
--

CREATE TABLE `nominas` (
  `id_nomina` bigint(20) UNSIGNED NOT NULL,
  `id_empleado` bigint(20) UNSIGNED NOT NULL,
  `id_empresa` bigint(20) UNSIGNED NOT NULL,
  `fecha` date NOT NULL,
  `salario_bruto` decimal(10,2) NOT NULL,
  `salario_neto` decimal(10,2) NOT NULL,
  `archivo_pdf` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `nominas`
--

INSERT INTO `nominas` (`id_nomina`, `id_empleado`, `id_empresa`, `fecha`, `salario_bruto`, `salario_neto`, `archivo_pdf`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '2025-01-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(2, 2, 2, '2025-02-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(3, 2, 2, '2025-03-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(4, 2, 2, '2025-04-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(5, 2, 2, '2025-05-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(7, 2, 2, '2025-06-28', 1750.00, 1500.00, NULL, '2025-06-09 08:13:18', '2025-06-09 08:13:18'),
(8, 1, 1, '2025-07-27', 1750.00, 1500.00, 'nominas/nomina_julio_2025.pdf', '2025-06-09 06:45:13', '2025-06-09 06:45:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id_notificacion` bigint(20) UNSIGNED NOT NULL,
  `id_empleado` bigint(20) UNSIGNED NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(22, 'App\\Models\\Empleado', 3, 'auth_token', 'b6961350d5f397de50f5ec440e6ed2605a88b93abcd3f3dc523ca32cf7ec21bb', '[\"*\"]', '2025-06-09 11:41:07', NULL, '2025-06-09 11:40:39', '2025-06-09 11:41:07'),
(23, 'App\\Models\\Empleado', 4, 'auth_token', 'a7cc57d3a08e25665076bbb036e25138486c576327ba4b50751468d50695869e', '[\"*\"]', '2025-06-09 11:42:50', NULL, '2025-06-09 11:41:22', '2025-06-09 11:42:50'),
(27, 'App\\Models\\Empleado', 1, 'auth_token', 'ad3354c1d0f49614a378d050e5fd3f2b2ef09c14bc01c07e1ce8a3f8126122b1', '[\"*\"]', '2025-06-09 14:27:25', NULL, '2025-06-09 14:26:36', '2025-06-09 14:27:25'),
(28, 'App\\Models\\Empleado', 6, 'auth_token', '3185e2b1216b350fb25c9064f31639f38b481b167323a513e6cc9dfa86e5686e', '[\"*\"]', '2025-06-09 16:07:01', NULL, '2025-06-09 14:27:39', '2025-06-09 16:07:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vacaciones`
--

CREATE TABLE `vacaciones` (
  `id_vacacion` bigint(20) UNSIGNED NOT NULL,
  `id_empleado` bigint(20) UNSIGNED NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `estado` enum('pendiente','aprobada','rechazada') NOT NULL DEFAULT 'pendiente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `vacaciones`
--

INSERT INTO `vacaciones` (`id_vacacion`, `id_empleado`, `fecha_inicio`, `fecha_fin`, `estado`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-07-13', '2025-07-20', 'aprobada', '2025-06-09 08:14:28', '2025-06-09 08:14:28'),
(2, 2, '2025-07-21', '2025-07-25', 'rechazada', '2025-06-09 08:14:28', '2025-06-09 07:24:32'),
(3, 6, '2025-06-24', '2025-06-26', 'aprobada', '2025-06-09 11:35:09', '2025-06-09 11:37:24'),
(4, 6, '2025-08-11', '2025-08-15', 'pendiente', '2025-06-09 14:27:58', '2025-06-09 14:27:58');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `empleados_email_unique` (`email`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `empresas_cif_unique` (`cif`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD PRIMARY KEY (`id_horario`),
  ADD KEY `horarios_id_empleado_foreign` (`id_empleado`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD PRIMARY KEY (`id_nomina`),
  ADD KEY `nominas_id_empleado_foreign` (`id_empleado`),
  ADD KEY `nominas_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id_notificacion`),
  ADD KEY `notificaciones_id_empleado_foreign` (`id_empleado`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD PRIMARY KEY (`id_vacacion`),
  ADD KEY `vacaciones_id_empleado_foreign` (`id_empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `empleados`
--
ALTER TABLE `empleados`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id_empresa` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horarios`
--
ALTER TABLE `horarios`
  MODIFY `id_horario` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `nominas`
--
ALTER TABLE `nominas`
  MODIFY `id_nomina` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id_notificacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  MODIFY `id_vacacion` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `horarios`
--
ALTER TABLE `horarios`
  ADD CONSTRAINT `horarios_id_empleado_foreign` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD CONSTRAINT `nominas_id_empleado_foreign` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `nominas_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_id_empleado_foreign` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vacaciones`
--
ALTER TABLE `vacaciones`
  ADD CONSTRAINT `vacaciones_id_empleado_foreign` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

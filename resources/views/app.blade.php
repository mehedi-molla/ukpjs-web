<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Umarkhali Kistupur Probashi Jubo Songho') }}</title>
        @inertiaHead
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
    </head>
    <body class="bg-stone-50 text-stone-900 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
        @inertia
    </body>
</html>

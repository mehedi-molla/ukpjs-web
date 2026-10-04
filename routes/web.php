<?php

use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DonationSubmissionController as AdminDonationSubmissionController;
use App\Http\Controllers\Admin\LedgerController;
use App\Http\Controllers\Admin\MemberController as AdminMemberController;
use App\Http\Controllers\Admin\MonthlyDonationController;
use App\Http\Controllers\Admin\NoticeController as AdminNoticeController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\WelfareController as AdminWelfareController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Portal\DashboardController;
use App\Http\Controllers\Portal\ReceiptController;
use App\Http\Controllers\Public\BloodDonorController;
use App\Http\Controllers\Public\ContactMessageController;
use App\Http\Controllers\Public\ContentController;
use App\Http\Controllers\Public\DonationSubmissionController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProjectController;
use App\Http\Controllers\Public\WelfareController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/about', [ContentController::class, 'show'])->defaults('page', 'about')->name('about');
Route::get('/emergency-contacts', [ContentController::class, 'show'])->defaults('page', 'emergency')->name('emergency');
Route::get('/contact', [ContentController::class, 'show'])->defaults('page', 'contact')->name('contact');
Route::get('/blood-donors', [ContentController::class, 'show'])->defaults('page', 'blood-donors')->name('blood-donors');
Route::get('/donate', [ContentController::class, 'show'])->defaults('page', 'donation')->name('donate');
Route::get('/notices', [ContentController::class, 'show'])->defaults('page', 'notices')->name('notices');
Route::get('/transparency', [ContentController::class, 'show'])->defaults('page', 'transparency')->name('transparency');
Route::get('/welfare/apply', [ContentController::class, 'show'])->defaults('page', 'welfare')->name('welfare.apply');
Route::get('/committee', [ContentController::class, 'show'])->defaults('page', 'committee')->name('committee');
Route::post('/donation-notifications', [DonationSubmissionController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('donation-notifications.store');
Route::post('/contact-messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:5,10')
    ->name('contact-messages.store');
Route::post('/welfare/apply', [WelfareController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('welfare.store');
Route::post('/blood-donors', [BloodDonorController::class, 'store'])
    ->middleware('throttle:3,10')
    ->name('blood-donors.store');

Route::middleware('guest')->group(function (): void {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:login')->name('login.store');
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('throttle:6,1')->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('throttle:6,1')->name('password.update');
});

Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/admin/dashboard', AdminDashboardController::class)->middleware('role:super_admin')->name('admin.dashboard');
    Route::get('/member/dashboard', [DashboardController::class, 'member'])->middleware('role:member')->name('member.dashboard');
    Route::get('/transactions/{transaction}/receipt', [ReceiptController::class, 'show'])->name('transactions.receipt');
    Route::middleware('role:super_admin')->prefix('admin')->name('admin.')->group(function (): void {
        Route::get('/transactions', [LedgerController::class, 'index'])->name('transactions.index');
        Route::post('/transactions', [LedgerController::class, 'store'])->name('transactions.store');
        Route::patch('/transactions/{transaction}/cancel', [LedgerController::class, 'cancel'])->name('transactions.cancel');
        Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::post('/projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::put('/projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::patch('/projects/{project}/archive', [AdminProjectController::class, 'archive'])->name('projects.archive');
        Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
        Route::post('/contacts', [AdminContactController::class, 'store'])->name('contacts.store');
        Route::put('/contacts/{contact}', [AdminContactController::class, 'update'])->name('contacts.update');
        Route::patch('/contacts/{contact}/archive', [AdminContactController::class, 'archive'])->name('contacts.archive');
        Route::get('/contact-messages', [AdminContactMessageController::class, 'index'])->name('contact-messages.index');
        Route::patch('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'review'])->name('contact-messages.review');
        Route::get('/members', [AdminMemberController::class, 'index'])->name('members.index');
        Route::post('/members', [AdminMemberController::class, 'store'])->name('members.store');
        Route::put('/members/{member}', [AdminMemberController::class, 'update'])->name('members.update');
        Route::patch('/members/{member}/archive', [AdminMemberController::class, 'archive'])->name('members.archive');
        Route::get('/monthly-donations', [MonthlyDonationController::class, 'index'])->name('monthly-donations.index');
        Route::post('/monthly-donations', [MonthlyDonationController::class, 'store'])->name('monthly-donations.store');
        Route::post('/monthly-donations/{monthlyDonation}/mark-paid', [MonthlyDonationController::class, 'markPaid'])->name('monthly-donations.mark-paid');
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::get('/notices', [AdminNoticeController::class, 'index'])->name('notices.index');
        Route::post('/notices', [AdminNoticeController::class, 'store'])->name('notices.store');
        Route::put('/notices/{notice}', [AdminNoticeController::class, 'update'])->name('notices.update');
        Route::patch('/notices/{notice}/archive', [AdminNoticeController::class, 'archive'])->name('notices.archive');
        Route::get('/settings', [AdminSettingsController::class, 'edit'])->name('settings.edit');
        Route::put('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
        Route::get('/welfare', [AdminWelfareController::class, 'index'])->name('welfare.index');
        Route::patch('/welfare/{welfareRequest}', [AdminWelfareController::class, 'update'])->name('welfare.update');
        Route::get('/donation-submissions', [AdminDonationSubmissionController::class, 'index'])->name('donation-submissions.index');
        Route::patch('/donation-submissions/{submission}', [AdminDonationSubmissionController::class, 'review'])->name('donation-submissions.review');
    });
});

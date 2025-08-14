import { Separator } from '@/common/components/ui/separator';
import { GitHubAuthStatusSection } from '../components/github-auth-status-section';
import { GitHubConfigErrorSection } from '../components/github-config-error-section';
import { GitHubNoteSyncSection } from '../components/github-note-sync-section';
import { GitHubStorageConfigSection } from '../components/github-storage-config-section';
import { GitHubUserInfoSection } from '../components/github-user-info-section';
import { GitHubDebugInfo } from '../components/github-debug-info';
import { useGitHubIntegrationPage } from '../hooks/use-github-integration-page';



export function GitHubIntegrationPage() {
    const {
        isAuthenticated,
        userInfo,
        noteContent,
        noteTitle,
        syncStatus,
        lastSync,
        configErrors,
        storageConfig,
        isStorageConfigured,
        setNoteContent,
        setNoteTitle,
        setStorageConfig,
        handleSyncNote,
        handleLogout
    } = useGitHubIntegrationPage();

    if (configErrors.length > 0) {
        return <GitHubConfigErrorSection configErrors={configErrors} />;
    }

    return (
        <div className="p-6">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        GitHub Integration
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Store and synchronize your data with GitHub repositories
                    </p>
                </div>

                {/* Authentication Status */}
                <GitHubAuthStatusSection />
                
                {/* Debug Information */}
                <GitHubDebugInfo />

                {isAuthenticated && (
                    <>
                        <Separator />

                        {/* User Information */}
                        {userInfo && <GitHubUserInfoSection userInfo={userInfo} onLogout={handleLogout} />}

                        <Separator />

                        {/* Data Synchronization */}
                        <GitHubNoteSyncSection
                            noteTitle={noteTitle}
                            noteContent={noteContent}
                            syncStatus={syncStatus}
                            lastSync={lastSync}
                            onNoteTitleChange={setNoteTitle}
                            onNoteContentChange={setNoteContent}
                            onSyncNote={handleSyncNote}
                        />

                        <Separator />

                        {/* Storage Configuration */}
                        <GitHubStorageConfigSection
                            storageConfig={storageConfig}
                            isStorageConfigured={isStorageConfigured}
                            onStorageConfigChange={setStorageConfig}
                            onResetConfig={() => setStorageConfig({ owner: '', repo: '', branch: '', basePath: '' })}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

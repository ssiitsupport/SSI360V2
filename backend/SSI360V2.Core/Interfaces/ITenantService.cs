using SSI360V2.Core.DTOs;

namespace SSI360V2.Core.Interfaces;

public interface ITenantService
{
    Task<TenantDto> CreateTenantAsync(CreateTenantDto createTenantDto);
    Task<TenantDto> UpdateTenantAsync(Guid id, UpdateTenantDto updateTenantDto);
    Task<TenantDto> GetTenantByIdAsync(Guid id);
    Task<TenantDto> GetTenantByDomainAsync(string domain);
    Task<PaginatedResult<TenantDto>> GetTenantsAsync(int page = 1, int pageSize = 10, string? search = null);
    Task<TenantDto> GetCurrentTenantAsync();
    Task DeleteTenantAsync(Guid id);
}
